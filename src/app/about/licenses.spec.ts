import { marked } from "marked";

import { collapsible, fence, thirdPartyLicensesMarkdown } from "./licenses";

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

  it("makes a collapsed entry with the name and the license per package", () => {
    expect(markdown).toContain("<summary>@ionic/core (MIT)</summary>");
    expect(markdown).toContain("<summary>tslib (0BSD)</summary>");
  });

  it("keeps the license text verbatim in a code block inside the entry", () => {
    expect(markdown).toContain(
      "```text\nCopyright 2015-present Drifty Co.\n\nTHE SOFTWARE IS PROVIDED *AS IS*.\n```\n\n</details>",
    );
  });

  it("says so for a package without a license text", () => {
    expect(markdown).toContain("<summary>tslib (0BSD)</summary>\n\nBrak treści licencji.");
  });

  it("renders to a details element with the code block inside", async () => {
    const html = await marked.parse(markdown);
    expect(html).toMatch(/<details>\s*<summary>@ionic\/core \(MIT\)<\/summary>\s*<pre><code class="language-text">/);
  });
});

describe("collapsible", () => {
  it("escapes the summary, which is HTML", () => {
    expect(collapsible("<a> & b", "x")).toContain("<summary>&#60;a&#62; &#38; b</summary>");
  });
});

describe("fence", () => {
  it("uses more backticks than the text has in a row", () => {
    expect(fence("a ```` b")).toBe("`````text\na ```` b\n`````");
  });
});
