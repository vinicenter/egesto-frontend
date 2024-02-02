import type { App } from "vue";
import * as Sentry from "@sentry/vue";

export const install = (app: App) => {
  const sentryDsn = import.meta.env.VITE_SENTRY_DSN;

  if (import.meta.env.DEV || !sentryDsn) {
    return
  }

  Sentry.init({
    app,
    dsn: sentryDsn,
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: ["up.railway.app", "vini.center"],
      }),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: process.env.NODE_ENV,
  });
}
