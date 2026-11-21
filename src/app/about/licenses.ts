/** A fenced code block, which keeps a license text verbatim. */
export function fence(text: string): string {
  const longest = Math.max(2, ...(text.match(/`+/g) ?? []).map((run) => run.length));
  const ticks = "`".repeat(longest + 1);
  return `${ticks}text\n${text}\n${ticks}`;
}

function escapeMarkdown(text: string): string {
  return text.replace(/[\\`*_[\]<>#]/g, "\\$&");
}

/**
 * Turns the 3rdpartylicenses.txt that the production build of Angular writes,
 * sections of `Package:`, `License:` and the license text between lines of
 * dashes, into Markdown: a heading per package, with its license text verbatim.
 */
export function thirdPartyLicensesMarkdown(text: string): string {
  return text
    .split(/^-{20,}$/m)
    .map((section) => section.trim())
    .filter(Boolean)
    .map((section) => {
      const match = section.match(/^Package: (.+)\nLicense: "?([^"\n]*)"?\n?([\s\S]*)$/);
      if (!match) {
        return fence(section);
      }
      const [, name, license, body] = match;
      const parts = [`### ${escapeMarkdown(name)}`, `Licencja: ${escapeMarkdown(license)}`];
      if (body.trim()) {
        parts.push(fence(body.trim()));
      }
      return parts.join("\n\n");
    })
    .join("\n\n");
}
