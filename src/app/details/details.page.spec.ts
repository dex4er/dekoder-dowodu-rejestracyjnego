import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";

import { CertificatesService } from "../shared/certificates.service";
import { MOCK_CERTIFICATE } from "../shared/mock-certificate";
import { DetailsPage } from "./details.page";

describe("DetailsPage", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsPage],
      providers: [provideRouter([])],
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
});
