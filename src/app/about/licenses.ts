/** A fenced code block, which keeps a license text verbatim. */
export function fence(text: string): string {
  const longest = Math.max(2, ...(text.match(/`+/g) ?? []).map((run) => run.length));
  const ticks = "`".repeat(longest + 1);
  return `${ticks}text\n${text}\n${ticks}`;
}

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);
}

/**
 * Markdown that the reader opens with a tap: a details element, whose body is
 * Markdown again thanks to the blank lines around it.
 */
export function collapsible(summary: string, body: string): string {
  return `<details>\n<summary>${escapeHtml(summary)}</summary>\n\n${body}\n\n</details>`;
}

/**
 * Turns the 3rdpartylicenses.txt that the production build of Angular writes,
 * sections of `Package:`, `License:` and the license text between lines of
 * dashes, into Markdown: per package a collapsed entry with its name and
 * license, and the license text verbatim inside.
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
      return collapsible(`${name} (${license})`, body.trim() ? fence(body.trim()) : "Brak treści licencji.");
    })
    .join("\n\n");
}
