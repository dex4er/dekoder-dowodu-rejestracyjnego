import type { PolishVehicleRegistrationCertificateData } from "polish-vehicle-registration-certificate-decoder";

/** The common shape of every field of the decoded certificate. */
export interface CertificateField {
  name: string;
  description: string;
  value: string | readonly string[];
  valueDescription?: string;
}

/** Names that the decoder gives to fields without a code on the certificate. */
const PLACEHOLDER_NAMES = new Set(["nd.", "?"]);

export function certificateFields(data: PolishVehicleRegistrationCertificateData): CertificateField[] {
  return Object.values(data) as CertificateField[];
}

/** The lines of a value; a coded value, as the fuel type, shows its description. */
export function fieldLines(field: CertificateField): readonly string[] {
  if (typeof field.value !== "string") {
    return field.value;
  }
  return [field.valueDescription || field.value];
}

/** The code and the description of a field, without the placeholder names. */
export function fieldLabel(field: CertificateField): string {
  const parts = [field.name, field.description].filter((part) => part && !PLACEHOLDER_NAMES.has(part));
  return parts.length > 0 ? parts.join(" ") : field.name;
}

/**
 * The certificate as text to share, one `field: value` line per field. A value
 * of several lines, as an address, is joined into one; empty fields are left
 * out.
 */
export function certificateText(data: PolishVehicleRegistrationCertificateData): string {
  return certificateFields(data)
    .map((field) => ({ label: fieldLabel(field), value: fieldLines(field).filter(Boolean).join(", ") }))
    .filter(({ value }) => value !== "")
    .map(({ label, value }) => `${label}: ${value}`)
    .join("\n");
}
