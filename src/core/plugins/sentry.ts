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
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracePropagationTargets: ["app.egesto.net", "api.egesto.net"],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    environment: process.env.NODE_ENV,
  });
}
