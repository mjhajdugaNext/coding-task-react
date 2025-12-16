/// <reference types="vitest" />

import { mapAccountsToView } from "@/lib/data";

const accounts = [
  { id: "A1", account_type: "primary", value: 1234.5, currency: "USD" },
  { id: "A2", account_type: "missing", value: 10, currency: "GBP" },
] as const;

const accountTypes = [
  { id: "primary", account_type_name: "Primary" },
  { id: "standard", account_type_name: "Standard" },
];

describe("mapAccountsToView", () => {
  it("maps and formats account data", () => {
    const result = mapAccountsToView([...accounts], [...accountTypes]);

    expect(result[0]).toMatchObject({
      id: "A1",
      accountTypeLabel: "Primary",
      value: 1234.5,
      valueFormatted: "1,234.50",
      currency: "USD",
    });
  });

  it("shows empty account type when mapping is missing", () => {
    const result = mapAccountsToView([...accounts], [...accountTypes]);
    expect(result[1].accountTypeLabel).toBe("");
  });

  it("leaves value fields empty when value is missing", () => {
    const result = mapAccountsToView(
      [{ id: "A3", account_type: "primary", currency: "USD" }],
      [...accountTypes],
    );
    expect(result[0].value).toBeUndefined();
    expect(result[0].valueFormatted).toBeUndefined();
  });
});
