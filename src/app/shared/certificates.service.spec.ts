import { TestBed } from "@angular/core/testing";

import { PolishVehicleRegistrationCertificateDecoder } from "polish-vehicle-registration-certificate-decoder";

import { CertificatesService } from "./certificates.service";
import { MOCK_CERTIFICATE } from "./mock-certificate";

describe("CertificatesService", () => {
  const data = new PolishVehicleRegistrationCertificateDecoder(MOCK_CERTIFICATE).data;
  let service: CertificatesService;

  beforeEach(() => {
    service = TestBed.inject(CertificatesService);
  });

  it("starts empty", () => {
    expect(service.count()).toBe(0);
    expect(service.list()).toEqual([]);
  });

  it("adds, fetches and deletes a certificate by its serial number", () => {
    service.add(data);
    expect(service.count()).toBe(1);
    expect(service.fetch("AAA0007046")).toBe(data);

    service.delete("AAA0007046");
    expect(service.count()).toBe(0);
    expect(service.fetch("AAA0007046")).toBeUndefined();
  });

  it("keeps one entry per serial number", () => {
    service.add(data);
    service.add(data);
    expect(service.list()).toEqual([data]);
  });

  it("labels a certificate with its registration number, make, model and serial number", () => {
    expect(service.label(data)).toBe(`${data.numerRejestracyjnyPojazdu.value} TOYOTA COROLLA AAA0007046`);
  });
});
