import { computed, Injectable, signal } from "@angular/core";

import { KeychainAccess, SecureStorage } from "@aparajita/capacitor-secure-storage";
import {
  type PolishVehicleRegistrationCertificateData,
  PolishVehicleRegistrationCertificateDecoder,
} from "polish-vehicle-registration-certificate-decoder";

export interface Certificate {
  data: PolishVehicleRegistrationCertificateData;
  /** The text of the Aztec code, which is what is stored. */
  raw: string;
  /** When it was scanned last, as an ISO 8601 timestamp. */
  scannedAt: string;
}

interface StoredCertificate {
  raw: string;
  scannedAt: string;
}

interface Stored {
  version: 1;
  certificates: StoredCertificate[];
}

export const STORAGE_KEY = "certificates";

@Injectable({
  providedIn: "root",
})
export class CertificatesService {
  private readonly certificates = signal<ReadonlyMap<string, Certificate>>(new Map());

  /** The certificates, scanned last first. */
  readonly list = computed(() =>
    [...this.certificates().values()].sort((a, b) => b.scannedAt.localeCompare(a.scannedAt)),
  );

  readonly count = computed(() => this.certificates().size);

  /**
   * Reads the stored certificates. The stored text is decoded again, so a fix
   * of the decoder applies to what was scanned before; an entry that no longer
   * decodes is skipped.
   */
  async load(): Promise<void> {
    let value: string | null;
    try {
      value = await SecureStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // The key of the Keystore can be lost, for example after a reset of the
      // lock screen on some devices; the certificates can be scanned again.
      console.error("Cannot read the stored certificates", e);
      return;
    }
    if (!value) {
      return;
    }

    let stored: Stored;
    try {
      stored = JSON.parse(value) as Stored;
    } catch (e) {
      console.error("Cannot read the stored certificates", e);
      return;
    }

    const certificates = new Map<string, Certificate>();
    for (const { raw, scannedAt } of stored.certificates ?? []) {
      try {
        const certificate = { data: decode(raw), raw, scannedAt };
        certificates.set(this.serial(certificate.data), certificate);
      } catch (e) {
        console.error("Cannot decode a stored certificate", e);
      }
    }
    this.certificates.set(certificates);
  }

  serial(data: PolishVehicleRegistrationCertificateData): string {
    return data.seriaDr.value;
  }

  /**
   * Decodes the text of a scanned Aztec code and stores the certificate.
   *
   * @throws an Error from the decoder when the text is not a certificate
   */
  async add(raw: string, scannedAt = new Date()): Promise<PolishVehicleRegistrationCertificateData> {
    const text = raw.trim();
    const data = decode(text);
    this.certificates.update((certificates) =>
      new Map(certificates).set(this.serial(data), { data, raw: text, scannedAt: scannedAt.toISOString() }),
    );
    await this.save();
    return data;
  }

  fetch(serial: string): PolishVehicleRegistrationCertificateData | undefined {
    return this.certificates().get(serial)?.data;
  }

  async delete(serial: string): Promise<void> {
    this.certificates.update((certificates) => {
      const result = new Map(certificates);
      result.delete(serial);
      return result;
    });
    await this.save();
  }

  label(data: PolishVehicleRegistrationCertificateData): string {
    return [
      data.numerRejestracyjnyPojazdu.value,
      data.markaPojazdu.value,
      data.modelPojazdu.value,
      data.seriaDr.value,
    ].join(" ");
  }

  private async save(): Promise<void> {
    const stored: Stored = {
      version: 1,
      certificates: this.list().map(({ raw, scannedAt }) => ({ raw, scannedAt })),
    };
    // On iOS the item stays out of backups and off other devices, as backup is
    // off on Android; elsewhere this is a no-op.
    await SecureStorage.setDefaultKeychainAccess(KeychainAccess.whenUnlockedThisDeviceOnly);
    await SecureStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  }
}

function decode(raw: string): PolishVehicleRegistrationCertificateData {
  return new PolishVehicleRegistrationCertificateDecoder(raw).data;
}
