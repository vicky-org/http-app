import * as Sentry from "@sentry/react";

function init() {
  Sentry.init({
    dsn: "https://f768cf9bf453957665aa0e1fc668809a@o4506101074624512.ingest.sentry.io/4506101130264576",
  });
}

function log(error) {
  Sentry.captureException(error);
}

export default {
  init,
  log,
};
