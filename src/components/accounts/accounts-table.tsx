"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

import type { AccountView, SortDirection, SortState, SortableColumn } from "@/lib/data";
import { sortAccounts } from "@/lib/sort";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Props = {
  accounts: AccountView[];
};

const columns: { key: SortableColumn; label: string }[] = [
  { key: "id", label: "Account ID" },
  { key: "accountTypeLabel", label: "Account Type" },
  { key: "value", label: "Value" },
  { key: "currency", label: "Currency" },
];

export function AccountsTable({ accounts }: Props) {
  const [sort, setSort] = useState<SortState>({ column: "id", direction: "asc" });

  const sortedAccounts = useMemo(
    () => sortAccounts(accounts, sort),
    [accounts, sort],
  );

  const onSort = (column: SortableColumn) => {
    setSort((prev) =>
      prev.column === column
        ? { column, direction: toggleDirection(prev.direction) }
        : { column, direction: "asc" },
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.key}
                aria-sort={
                  sort.column === column.key
                    ? sort.direction === "asc"
                      ? "ascending"
                      : "descending"
                    : "none"
                }
              >
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  className="flex items-center gap-2 px-0 font-semibold hover:bg-transparent"
                  onClick={() => onSort(column.key)}
                >
                  {column.label}
                  <SortIcon
                    active={sort.column === column.key}
                    direction={sort.direction}
                  />
                </Button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedAccounts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-6 text-center text-sm text-muted-foreground">
                No accounts found.
              </TableCell>
            </TableRow>
          ) : (
            sortedAccounts.map((account) => (
              <TableRow key={account.id} className="hover:bg-muted/60">
                <TableCell className="font-medium">{account.id}</TableCell>
                <TableCell>{account.accountTypeLabel}</TableCell>
                <TableCell className="tabular-nums">{account.valueFormatted}</TableCell>
                <TableCell>{account.currency}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function toggleDirection(direction: SortDirection): SortDirection {
  return direction === "asc" ? "desc" : "asc";
}

function SortIcon({ active, direction }: { active: boolean; direction: SortDirection }) {
  const Icon = !active ? ArrowUpDown : direction === "asc" ? ArrowUp : ArrowDown;
  return <Icon className={cn("h-4 w-4 text-muted-foreground", active && "text-foreground")} />;
}
