import { ensureMockServer } from "@/mocks/init-server";

const isMock = process.env.MOCK_API === "true";
const logErrors = process.env.LOG_ERROR_LOGS === "true";

const apiKey = process.env.SUPABASE_API_KEY;
const supabaseBaseUrl =
  process.env.SUPABASE_URL ?? "https://pmpgzuqkhfivzkmjtzng.supabase.co";

function ensureApiKey(): string {
  if (isMock) return "mock-api-key";
  if (!apiKey) {
    throw new Error(
      "Missing SUPABASE_API_KEY. Provide it at runtime (e.g. env var in Amplify).",
    );
  }
  return apiKey;
}

type RequestInitExtended = Pick<RequestInit, "method" | "body" | "signal" | "headers">;

export async function httpRequest<T>(path: string, options: RequestInitExtended = {}): Promise<T> {
  if (isMock) {
    await ensureMockServer();
  }

  const key = ensureApiKey();
  const url = `${supabaseBaseUrl}${path}`;

  const { method = "GET", body, signal, headers: extraHeaders = {} } = options;

  try {
    const response = await fetch(url, {
      method,
      headers: {
        apikey: key,
        "Content-Type": "application/json",
        ...extraHeaders,
      },
      cache: "no-store",
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });

    if (!response.ok) {
      const error = new Error(
        `Request failed ${method} ${path} -> ${response.status} ${response.statusText}`,
      );
      throw error;
    }

    return response.json();
  } catch (err) {
    const error =
      err instanceof Error
        ? err
        : new Error(`Failed to fetch ${path}: ${String(err)}`);
    if (logErrors) {
      console.error("[httpRequest]", error);
    }
    throw error;
  }
}