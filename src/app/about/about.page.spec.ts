import { version } from "../../../package.json";
import { aboutMarkdown } from "./about.page";

describe("aboutMarkdown", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function stubFetch(files: Record<string, string>): void {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (url: string) => (url in files ? new Response(files[url]) : new Response("", { status: 404 }))),
    );
  }

  it("puts the about text, the license and the licenses of the libraries on one page", async () => {
    stubFetch({
      "assets/about.md": "# Dekoder\n\nWersja {version}",
      "LICENSE.txt": "GPL-2.0\n\nGNU GENERAL PUBLIC LICENSE",
      "3rdpartylicenses.txt": `${"-".repeat(80)}\nPackage: marked\nLicense: "MIT"\n\nMIT License\n`,
    });

    const markdown = await aboutMarkdown();

    expect(markdown).toContain(`Wersja ${version}`);
    expect(markdown).toContain("## Licencja\n\n```text\nGPL-2.0\n\nGNU GENERAL PUBLIC LICENSE\n```");
    expect(markdown).toContain("## Licencje użytych bibliotek\n\n### marked\n\nLicencja: MIT");
  });

  it("says where the licenses of the libraries are when the build has none", async () => {
    stubFetch({ "assets/about.md": "# Dekoder", "LICENSE.txt": "GPL-2.0" });

    expect(await aboutMarkdown()).toContain("Lista jest dostępna w wersji produkcyjnej aplikacji.");
  });
});
