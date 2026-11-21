import { version } from "../../../package.json";

/** What the about page and the empty list tell about the app. */
export const APP_INFO = {
  name: "Dekoder dowodu rejestracyjnego",
  version,
  copyright: "© 2018–2026 Piotr Roszatycki",
  email: "piotr.roszatycki@gmail.com",
  source: "https://github.com/dex4er/dekoder-dowodu-rejestracyjnego",
} as const;
