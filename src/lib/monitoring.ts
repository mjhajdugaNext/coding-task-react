type MonitoringPayload = {
  message: string;
  stack?: string;
  extra?: unknown;
};

const serverEndpoint = process.env.MONITORING_ENDPOINT;
const clientEndpoint = process.env.NEXT_PUBLIC_MONITORING_URL;

export function reportServerError(error: unknown, extras?: unknown) {
  const payload: MonitoringPayload = normalizeError(error, extras);
  if (!serverEndpoint) {
    // Avoid throwing if monitoring is not configured.
    return;
  }

  void fetch(serverEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  }).catch(() => {
    // Swallow to avoid hard failures during reporting.
  });
}

export function reportClientError(error: unknown, extras?: unknown) {
  if (typeof window === "undefined") return;
  const payload: MonitoringPayload = normalizeError(error, extras);

  if (!clientEndpoint) {
    console.error("[monitoring]", payload);
    return;
  }

  void fetch(clientEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {
    console.error("[monitoring]", payload);
  });
}

function normalizeError(error: unknown, extras?: unknown): MonitoringPayload {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack, extra: extras };
  }
  if (typeof error === "string") {
    return { message: error, extra: extras };
  }
  return { message: "Unknown error", extra: { error, extras } };
}
