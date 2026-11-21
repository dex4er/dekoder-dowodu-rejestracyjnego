import { SecureStorage } from "@aparajita/capacitor-secure-storage";

import { CertificatesService, STORAGE_KEY } from "./certificates.service";
import { MOCK_CERTIFICATE } from "./mock-certificate";

describe("CertificatesService", () => {
  let service: CertificatesService;

  // Outside a device SecureStorage runs its web implementation on localStorage.
  beforeEach(async () => {
    localStorage.clear();
    service = new CertificatesService();
  });

  /** A new service, as after a restart of the app. */
  async function reloaded(): Promise<CertificatesService> {
    const result = new CertificatesService();
    await result.load();
    return result;
  }

  it("starts empty", async () => {
    await service.load();
    expect(service.count()).toBe(0);
    expect(service.list()).toEqual([]);
  });

  it("decodes, fetches and deletes a certificate by its serial number", async () => {
    const data = await service.add(MOCK_CERTIFICATE);
    expect(service.count()).toBe(1);
    expect(service.fetch("AAA0007046")).toBe(data);

    await service.delete("AAA0007046");
    expect(service.count()).toBe(0);
    expect(service.fetch("AAA0007046")).toBeUndefined();
  });

  it("rejects text that is not a certificate and stores nothing", async () => {
    await expect(service.add("not a certificate")).rejects.toThrow();
    expect(service.count()).toBe(0);
    expect(await SecureStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("keeps one entry per serial number, moved to the top by a new scan", async () => {
    await service.add(MOCK_CERTIFICATE, new Date("2026-11-01T10:00:00Z"));
    await service.add(MOCK_CERTIFICATE, new Date("2026-11-02T10:00:00Z"));
    expect(service.list().map((item) => item.scannedAt)).toEqual(["2026-11-02T10:00:00.000Z"]);
  });

  it("skips a stored entry that no longer decodes", async () => {
    await SecureStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        certificates: [
          { raw: MOCK_CERTIFICATE, scannedAt: "2026-11-01T10:00:00.000Z" },
          { raw: "not a certificate", scannedAt: "2026-11-03T10:00:00.000Z" },
        ],
      }),
    );
    await service.load();
    expect(service.list().map((item) => item.scannedAt)).toEqual(["2026-11-01T10:00:00.000Z"]);
  });

  it("keeps the certificates across a restart", async () => {
    await service.add(MOCK_CERTIFICATE, new Date("2026-11-01T10:00:00Z"));

    const restarted = await reloaded();
    expect(restarted.count()).toBe(1);
    expect(restarted.fetch("AAA0007046")?.markaPojazdu.value).toBe("TOYOTA");
    expect(restarted.list()[0].scannedAt).toBe("2026-11-01T10:00:00.000Z");

    await restarted.delete("AAA0007046");
    expect((await reloaded()).count()).toBe(0);
  });

  it("starts empty when the stored value cannot be read", async () => {
    await SecureStorage.setItem(STORAGE_KEY, "{");
    await service.load();
    expect(service.count()).toBe(0);
  });

  it("labels a certificate with its registration number, make, model and serial number", async () => {
    const data = await service.add(MOCK_CERTIFICATE);
    expect(service.label(data)).toBe(`${data.numerRejestracyjnyPojazdu.value} TOYOTA COROLLA AAA0007046`);
  });
});
