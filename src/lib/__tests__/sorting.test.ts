/// <reference types="vitest" />

import type { SortableColumnConfig, SortState } from "@/lib/sort";
import { sortRows } from "@/lib/sort";

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

const columns: SortableColumnConfig<typeof accounts[number], keyof typeof accounts[number]>[] = [
  { key: "id", accessor: (row) => row.id },
  { key: "accountTypeLabel", accessor: (row) => row.accountTypeLabel },
  { key: "value", accessor: (row) => row.value },
  { key: "currency", accessor: (row) => row.currency },
];

describe("sortRows", () => {
  it("sorts ascending by id by default", () => {
    const sort: SortState<"id"> = { column: "id", direction: "asc" };
    const sorted = sortRows(accounts, sort, columns);
    expect(sorted[0].id).toBe("ACT01");
  });

  it("sorts descending by value", () => {
    const sort: SortState<"value"> = { column: "value", direction: "desc" };
    const sorted = sortRows(accounts, sort, columns);
    expect(sorted[0].value).toBe(200);
  });
});
