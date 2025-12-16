import type { AccountRecord, AccountTypeRecord } from "@/lib/data";

export type MockScenario = {
  scenario?: "error-accounts" | "empty-account-types" | "error-account-types";
  accounts?: AccountRecord[];
  accountTypes?: AccountTypeRecord[];
};

type GlobalWithScenario = typeof globalThis & { __MSW_SCENARIO__?: MockScenario };

function getGlobalStore(): GlobalWithScenario {
  return globalThis as GlobalWithScenario;
}

export function setMockScenario(next: MockScenario) {
  getGlobalStore().__MSW_SCENARIO__ = next;
}

export function clearMockScenario() {
  getGlobalStore().__MSW_SCENARIO__ = {};
}

export function getMockScenario(): MockScenario {
  return getGlobalStore().__MSW_SCENARIO__ ?? {};
}
