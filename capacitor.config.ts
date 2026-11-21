import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  // The application id of the Play Store listing since 2018; an update must
  // keep it.
  appId: "com.github.dex4er.dekoder_dowodu_rejestracyjnego",
  appName: "Dekoder dowodu rejestracyjnego",
  webDir: "www",
  android: {
    // Capacitor shows an error page instead of a broken app on an older
    // WebView; the version matches the oldest Chrome in .browserslistrc.
    minWebViewVersion: 107,
  },
};

export default config;
