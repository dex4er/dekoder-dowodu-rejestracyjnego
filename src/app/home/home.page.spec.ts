import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";

import { NavController, provideIonicAngular } from "@ionic/angular";

import { ScannerService } from "../scan/scanner.service";
import { CertificatesService } from "../shared/certificates.service";
import { HomePage } from "./home.page";

describe("HomePage", () => {
  let navigateForward: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    navigateForward = vi.fn().mockResolvedValue(true);
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideRouter([]), provideIonicAngular(), { provide: NavController, useValue: { navigateForward } }],
    }).compileComponents();
  });

  it("decodes a scanned code and opens its details", async () => {
    const page = TestBed.createComponent(HomePage).componentInstance;

    await page.scan();

    expect(TestBed.inject(CertificatesService).count()).toBe(1);
    expect(page.error()).toBeUndefined();
    expect(navigateForward).toHaveBeenCalledWith(["/details", "AAA0007046"]);
  });

  it("shows the scanned text when it cannot be decoded", async () => {
    vi.spyOn(TestBed.inject(ScannerService), "scan").mockResolvedValue("not a certificate");
    const page = TestBed.createComponent(HomePage).componentInstance;

    await page.scan();

    expect(TestBed.inject(CertificatesService).count()).toBe(0);
    expect(page.error()?.text).toBe("not a certificate");
    expect(navigateForward).not.toHaveBeenCalled();
  });

  it("does nothing when the scan is cancelled", async () => {
    vi.spyOn(TestBed.inject(ScannerService), "scan").mockResolvedValue(undefined);
    const page = TestBed.createComponent(HomePage).componentInstance;

    await page.scan();

    expect(page.error()).toBeUndefined();
    expect(navigateForward).not.toHaveBeenCalled();
  });
});
