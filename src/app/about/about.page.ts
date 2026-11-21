import { Component, type OnInit, signal } from "@angular/core";

import { IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/angular";

import { marked } from "marked";

import { APP_INFO } from "../shared/app-info";
import { collapsible, fence, thirdPartyLicensesMarkdown } from "./licenses";

async function fetchText(url: string): Promise<string | undefined> {
  try {
    const response = await fetch(url);
    return response.ok ? await response.text() : undefined;
  } catch {
    return undefined;
  }
}

/**
 * The about page: the text of assets/about.md, then the license of the app and
 * the licenses of the libraries, all as one Markdown document.
 */
export async function aboutMarkdown(): Promise<string> {
  const [about, license, thirdParty] = await Promise.all([
    fetchText("assets/about.md"),
    fetchText("LICENSE.txt"),
    // The production build writes it; the development server has none.
    fetchText("3rdpartylicenses.txt"),
  ]);
  return [
    (about ?? `# ${APP_INFO.name}`).replaceAll("{version}", APP_INFO.version),
    "## Licencja",
    "GPL-2.0",
    ...(license ? [collapsible("Pełny tekst licencji", fence(license.trim()))] : []),
    "## Licencje użytych bibliotek",
    thirdParty ? thirdPartyLicensesMarkdown(thirdParty) : "Lista jest dostępna w wersji produkcyjnej aplikacji.",
  ].join("\n\n");
}

@Component({
  selector: "app-about",
  templateUrl: "about.page.html",
  styleUrl: "about.page.scss",
  imports: [IonBackButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar],
})
export class AboutPage implements OnInit {
  readonly html = signal("");

  async ngOnInit(): Promise<void> {
    this.html.set(await marked.parse(await aboutMarkdown()));
  }
}
