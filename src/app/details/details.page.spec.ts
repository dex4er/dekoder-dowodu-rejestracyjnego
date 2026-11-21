import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";

import { ShareWeb } from "@capacitor/share/dist/esm/web";
import { provideIonicAngular, ToastController } from "@ionic/angular";

import { CertificatesService } from "../shared/certificates.service";
import { MOCK_CERTIFICATE } from "../shared/mock-certificate";
import { DetailsPage } from "./details.page";

describe("DetailsPage", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsPage],
      providers: [provideRouter([]), provideIonicAngular()],
    }).compileComponents();
    localStorage.clear();
    await TestBed.inject(CertificatesService).add(MOCK_CERTIFICATE);
  });

  it("lists every field of the certificate", () => {
    const fixture = TestBed.createComponent(DetailsPage);
    fixture.componentRef.setInput("serial", "AAA0007046");
    fixture.detectChanges();

    const page = fixture.componentInstance;
    expect(page.label()).toContain("TOYOTA COROLLA AAA0007046");
    expect(page.fields().length).toBeGreaterThan(10);

    const text = (fixture.nativeElement as HTMLElement).textContent ?? "";
    expect(text).toContain("TOYOTA");
  });

  it("shows the description of a coded value instead of the code", () => {
    const page = TestBed.createComponent(DetailsPage).componentInstance;
    expect(page.lines({ name: "P.3", description: "", value: "D", valueDescription: "olej napędowy" })).toEqual([
      "olej napędowy",
    ]);
    expect(page.lines({ name: "C.2.3", description: "", value: ["a", "b"] })).toEqual(["a", "b"]);
  });

  describe("share", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    function page() {
      const fixture = TestBed.createComponent(DetailsPage);
      fixture.componentRef.setInput("serial", "AAA0007046");
      return fixture.componentInstance;
    }

    // Outside a device the Share plugin runs its web implementation.
    it("shares the certificate as field: value lines", async () => {
      const share = vi.spyOn(ShareWeb.prototype, "share").mockResolvedValue({});

      await page().share();

      expect(share).toHaveBeenCalledTimes(1);
      const options = share.mock.calls[0][0];
      expect(options.title).toContain("TOYOTA COROLLA AAA0007046");
      expect(options.text).toContain("D.1 marka pojazdu: TOYOTA");
    });

    it("stays quiet when the share sheet is closed without a choice", async () => {
      vi.spyOn(ShareWeb.prototype, "share").mockRejectedValue(new Error("Share canceled"));
      const toast = vi.spyOn(TestBed.inject(ToastController), "create");

      await page().share();

      expect(toast).not.toHaveBeenCalled();
    });
  });
});
