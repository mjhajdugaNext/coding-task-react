import "server-only";

import { z } from "zod";

import { formatValue } from "@/lib/format";
import { reportServerError } from "@/lib/monitoring";
import { ensureMockServer } from "@/mocks/init-server";

const valueSchema = z.preprocess(
  (val) => (typeof val === "string" ? Number(val) : val),
  z.number().optional(),
);

const accountSchema = z
  .object({
    id: z.string(),
    account_type: z.string().optional(),
    value: valueSchema,
    currency: z.string().optional(),
  });

const accountTypeSchema = z.object({
  id: z.string(),
  account_type_name: z.string().optional(),
});

const accountsResponseSchema = z.array(accountSchema);
const accountTypesResponseSchema = z.array(accountTypeSchema);

export type AccountRecord = z.infer<typeof accountSchema>;
export type AccountTypeRecord = z.infer<typeof accountTypeSchema>;

const accountViewSchema = z.object({
  id: z.string(),
  accountTypeLabel: z.string().optional(),
  value: z.number().optional(),
  valueFormatted: z.string().optional(),
  currency: z.string().optional(),
});
export type AccountView = z.infer<typeof accountViewSchema>;
const accountViewArraySchema = z.array(accountViewSchema);

export type SortableColumn = "id" | "accountTypeLabel" | "value" | "currency";
export type SortDirection = "asc" | "desc";
export type SortState = { column: SortableColumn; direction: SortDirection };

const accountsPath = "/rest/v1/accounts?select=*";
const accountTypesPath = "/rest/v1/account_types?select=*";

const isMock = process.env.MOCK_API === "true";
const logApiDebug = process.env.LOG_API_DEBUG === "true";

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

type RequestInitExtended = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
};

async function requestJson<T>(path: string, options: RequestInitExtended = {}): Promise<T> {
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
      const errorPayload = await response.text();
      const error = new Error(
        `Request failed ${method} ${path} -> ${response.status} ${response.statusText}`,
      );
      reportServerError(error, { extra: errorPayload });
      throw error;
    }

    return response.json();
  } catch (err) {
    const error =
      err instanceof Error
        ? err
        : new Error(`Failed to fetch ${path}: ${String(err)}`);
    reportServerError(error);
    throw error;
  }
}

export async function fetchAccounts(signal?: AbortSignal): Promise<AccountRecord[]> {
  const raw = await requestJson<AccountRecord[]>(accountsPath, { signal });
  if (logApiDebug) {
    console.info("[accounts-api-raw]", Array.isArray(raw) ? raw.slice(0, 5) : raw);
  }
  const parsedResult = accountsResponseSchema.parse(raw);
  const parsed = parsedResult.map((item) => ({
    id: item.id,
    account_type: item.account_type,
    value: item.value,
    currency: item.currency,
  }));

  return parsed;
}

export async function fetchAccountTypes(
  signal?: AbortSignal,
): Promise<AccountTypeRecord[]> {
  const raw = await requestJson<AccountTypeRecord[]>(accountTypesPath, { signal });
  if (logApiDebug) {
    console.info(
      "[account-types-api-raw]",
      Array.isArray(raw) ? raw.slice(0, 5) : raw,
    );
  }
  const parsedResult = accountTypesResponseSchema.safeParse(raw);
  if (!parsedResult.success) {
    reportServerError(parsedResult.error);
    return [];
  }

  const parsed = parsedResult.data.map((item) => ({
    id: item.id,
    account_type_name: item.account_type_name,
  }));

  return parsed;
}

export function mapAccountsToView(
  accounts: AccountRecord[],
  accountTypes: AccountTypeRecord[],
): AccountView[] {
  const typeMap = new Map<string, string>();

  accountTypes.forEach((type) => {
    if (typeof type.account_type_name === "string") {
      typeMap.set(type.id, type.account_type_name);
    }
  });

  const mapped = accounts.map((account) => {
    const label =
      account.account_type && typeMap.has(account.account_type)
        ? typeMap.get(account.account_type)
        : "";

    return {
      id: account.id,
      accountTypeLabel: label,
      value: account.value,
      valueFormatted:
        typeof account.value === "number" ? formatValue(account.value) : undefined,
      currency: account.currency,
    };
  });

  return accountViewArraySchema.parse(mapped);
}

export async function getAccountView(signal?: AbortSignal): Promise<AccountView[]> {
  const [accounts, accountTypes] = await Promise.all([
    fetchAccounts(signal),
    fetchAccountTypes(signal).catch((error) => {
      reportServerError(error);
      return [];
    }),
  ]);
  return mapAccountsToView(accounts, accountTypes);
}
