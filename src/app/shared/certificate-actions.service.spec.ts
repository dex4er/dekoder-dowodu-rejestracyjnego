import { TestBed } from "@angular/core/testing";

import { AlertController, provideIonicAngular, ToastController } from "@ionic/angular";

import { CertificateActionsService } from "./certificate-actions.service";
import { CertificatesService } from "./certificates.service";
import { MOCK_CERTIFICATE } from "./mock-certificate";

describe("CertificateActionsService", () => {
  let certificates: CertificatesService;
  let actions: CertificateActionsService;
  let alert: ReturnType<typeof vi.spyOn>;

  /** The alert closes with the button of this role. */
  function answer(role: string | undefined): void {
    alert.mockResolvedValue({
      present: vi.fn().mockResolvedValue(undefined),
      onDidDismiss: vi.fn().mockResolvedValue({ role }),
    } as unknown as HTMLIonAlertElement);
  }

  beforeEach(async () => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideIonicAngular()] });
    certificates = TestBed.inject(CertificatesService);
    actions = TestBed.inject(CertificateActionsService);
    alert = vi.spyOn(TestBed.inject(AlertController), "create");
    vi.spyOn(TestBed.inject(ToastController), "create").mockResolvedValue({
      present: vi.fn().mockResolvedValue(undefined),
    } as unknown as HTMLIonToastElement);
    await certificates.add(MOCK_CERTIFICATE);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("asks before deleting, with the label of the certificate", async () => {
    answer("cancel");

    await actions.delete(certificates.list()[0].data);

    expect(alert).toHaveBeenCalledWith(
      expect.objectContaining({
        header: "Usunąć dowód rejestracyjny?",
        message: expect.stringContaining("TOYOTA COROLLA AAA0007046"),
      }),
    );
  });

  it("deletes when the user confirms", async () => {
    answer("destructive");

    expect(await actions.delete(certificates.list()[0].data)).toBe(true);
    expect(certificates.count()).toBe(0);
  });

  it("keeps the certificate when the user cancels", async () => {
    answer("cancel");

    expect(await actions.delete(certificates.list()[0].data)).toBe(false);
    expect(certificates.count()).toBe(1);
  });

  it("keeps the certificate when the alert is closed otherwise", async () => {
    answer("backdrop");

    expect(await actions.delete(certificates.list()[0].data)).toBe(false);
    expect(certificates.count()).toBe(1);
  });
});
