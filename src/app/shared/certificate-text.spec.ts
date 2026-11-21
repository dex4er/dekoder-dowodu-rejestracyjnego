import { PolishVehicleRegistrationCertificateDecoder } from "polish-vehicle-registration-certificate-decoder";

import { certificateText, fieldLabel, fieldLines } from "./certificate-text";
import { MOCK_CERTIFICATE } from "./mock-certificate";

describe("certificateText", () => {
  const lines = certificateText(new PolishVehicleRegistrationCertificateDecoder(MOCK_CERTIFICATE).data).split("\n");

  it("writes one field: value line per field", () => {
    expect(lines).toContain("A numer rejestracyjny pojazdu: DMI 1PNK");
    expect(lines).toContain("D.1 marka pojazdu: TOYOTA");
    expect(lines).toContain("SERIA DR: AAA0007046");
    for (const line of lines) {
      expect(line).toMatch(/^[^\n]+: [^\n]+$/);
    }
  });

  it("leaves out the placeholder names of fields without a code", () => {
    expect(lines).toContain("identyfikator formatu: XXC1");
    expect(lines).toContain("rodzaj - kod: 03");
    expect(lines).toContain("nd.: 1465058");
  });

  it("joins a value of several lines into one", () => {
    expect(lines).toContain(
      "ORGAN WYDAJĄCY: PREZYDENT M. ST. WARSZAWY, DZIELNICA MOKOTÓW, UL. RAKOWIECKA 25/27, 02-517 WARSZAWA",
    );
  });

  it("writes the description of a coded value", () => {
    expect(lines).toContain("P.3 rodzaj paliwa: benzyna");
  });

  it("leaves out empty fields and keeps the not-applicable marks", () => {
    expect(lines.some((line) => line.startsWith("D.2 wersja"))).toBe(false);
    expect(lines).toContain("S.2 liczba miejsc stojących, jeżeli występuje: ---");
  });
});

describe("fieldLabel and fieldLines", () => {
  it("falls back to the placeholder name when there is nothing else", () => {
    expect(fieldLabel({ name: "?", description: "", value: "x" })).toBe("?");
  });

  it("keeps the lines of a value of several lines", () => {
    expect(fieldLines({ name: "X", description: "", value: ["a", "b"] })).toEqual(["a", "b"]);
  });
});
