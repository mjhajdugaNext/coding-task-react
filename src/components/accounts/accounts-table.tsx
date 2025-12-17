"use client";

import type { AccountView } from "@/lib/data";
import type { SortState } from "@/lib/sort";
import { AppTable, type Column } from "@/components/ui/app-table";

type Props = {
  accounts: AccountView[];
};

const columns = [
  {
    key: "id",
    label: "Account ID",
    accessor: (row: AccountView) => row.id,
  },
  {
    key: "accountTypeLabel",
    label: "Account Type",
    accessor: (row: AccountView) => row.accountTypeLabel ?? "",
  },
  {
    key: "value",
    label: "Value",
    accessor: (row: AccountView) => row.value ?? 0,
    render: (row: AccountView) => row.valueFormatted,
  },
  {
    key: "currency",
    label: "Currency",
    accessor: (row: AccountView) => row.currency ?? "",
  },
] as Column<AccountView, "id" | "accountTypeLabel" | "value" | "currency">[];

const defaultSort: SortState<(typeof columns)[number]["key"]> = {
  column: "id",
  direction: "asc",
};

export function AccountsTable({ accounts }: Props) {
  return (
    <AppTable
      rows={accounts}
      columns={columns}
      getRowId={(row) => row.id}
      initialSort={defaultSort}
      emptyMessage="No accounts found."
    />
  );
}
