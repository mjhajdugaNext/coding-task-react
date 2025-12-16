/// <reference types="vitest" />

import { sortAccounts } from "@/lib/sort";

const accounts = [
  {
    id: "ACT02",
    accountTypeLabel: "primary",
    value: 200,
    valueFormatted: "200.00",
    currency: "USD",
  },
  {
    id: "ACT01",
    accountTypeLabel: "standard",
    value: 100,
    valueFormatted: "100.00",
    currency: "GBP",
  },
];

describe("sortAccounts", () => {
  it("sorts ascending by id by default", () => {
    const sorted = sortAccounts(accounts, { column: "id", direction: "asc" });
    expect(sorted[0].id).toBe("ACT01");
  });

  it("sorts descending by value", () => {
    const sorted = sortAccounts(accounts, { column: "value", direction: "desc" });
    expect(sorted[0].value).toBe(200);
  });
});
