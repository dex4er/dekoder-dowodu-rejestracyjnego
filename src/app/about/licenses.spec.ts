import { fence, thirdPartyLicensesMarkdown } from "./licenses";

const DASHES = "-".repeat(80);

describe("thirdPartyLicensesMarkdown", () => {
  const text = [
    "",
    DASHES,
    "Package: @ionic/core",
    'License: "MIT"',
    "",
    "Copyright 2015-present Drifty Co.",
    "",
    "THE SOFTWARE IS PROVIDED *AS IS*.",
    "",
    DASHES,
    "Package: tslib",
    'License: "0BSD"',
    "",
    DASHES,
    "",
  ].join("\n");

  const markdown = thirdPartyLicensesMarkdown(text);

  it("makes a heading and a license line per package", () => {
    expect(markdown).toContain("### @ionic/core\n\nLicencja: MIT");
    expect(markdown).toContain("### tslib\n\nLicencja: 0BSD");
  });

  it("keeps the license text verbatim in a code block", () => {
    expect(markdown).toContain("```text\nCopyright 2015-present Drifty Co.\n\nTHE SOFTWARE IS PROVIDED *AS IS*.\n```");
  });

  it("leaves out the code block of a package without a license text", () => {
    expect(markdown.endsWith("Licencja: 0BSD")).toBe(true);
  });
});

describe("fence", () => {
  it("uses more backticks than the text has in a row", () => {
    expect(fence("a ```` b")).toBe("`````text\na ```` b\n`````");
  });
});
