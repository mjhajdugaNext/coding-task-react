import { http, HttpResponse } from "msw";

import mockAccounts from "@/mocks/accounts";
import mockAccountTypes from "@/mocks/accountTypes";
import { getMockScenario } from "@/mocks/scenario-store";

const accountsUrl = "https://pmpgzuqkhfivzkmjtzng.supabase.co/rest/v1/accounts";
const accountTypesUrl = "https://pmpgzuqkhfivzkmjtzng.supabase.co/rest/v1/account_types";

export const handlers = [
  http.get(accountsUrl, async () => {
    const scenario = getMockScenario();
    if (scenario.scenario === "error-accounts") {
      return HttpResponse.json({ message: "Mocked error" }, { status: 500 });
    }
    return HttpResponse.json(scenario.accounts ?? mockAccounts);
  }),
  http.get(accountTypesUrl, async () => {
    const scenario = getMockScenario();
    if (scenario.scenario === "error-account-types") {
      return HttpResponse.json({ message: "Mocked error" }, { status: 500 });
    }
    if (scenario.scenario === "empty-account-types") {
      return HttpResponse.json(scenario.accountTypes ?? []);
    }
    return HttpResponse.json(scenario.accountTypes ?? mockAccountTypes);
  }),
];
