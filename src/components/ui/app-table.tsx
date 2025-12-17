import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useMemo, useState } from "react";

import type { SortState, SortableColumnConfig, SortDirection } from "@/lib/sort";
import { sortRows } from "@/lib/sort";
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

export type Column<T, K extends string> = SortableColumnConfig<T, K> & {
  label: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
};

type Props<T, K extends string> = {
  rows: T[];
  columns: Column<T, K>[];
  getRowId: (row: T) => string;
  initialSort?: SortState<K>;
  emptyMessage?: string;
};

export function AppTable<T, K extends string>({
  rows,
  columns,
  getRowId,
  initialSort,
  emptyMessage = "No data found.",
}: Props<T, K>) {
  const defaultSort: SortState<K> =
    initialSort ?? { column: columns[0]?.key ?? ("id" as K), direction: "asc" };

  const [sort, setSort] = useState<SortState<K>>(defaultSort);

  const sortableColumns: Array<SortableColumnConfig<T, K>> = useMemo(
    () =>
      columns
        .filter((col) => col.sortable ?? true)
        .map(({ key, accessor, compare }) => ({ key, accessor, compare })),
    [columns],
  );

  const sortedRows = useMemo(
    () => sortRows(rows, sort, sortableColumns),
    [rows, sort, sortableColumns],
  );

  const onSort = (column: K) => {
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
            {columns.map((column) => {
              const isActive = sort.column === column.key;
              const sortable = column.sortable ?? true;
              return (
                <TableHead
                  key={column.key}
                  aria-sort={
                    sortable
                      ? isActive
                        ? sort.direction === "asc"
                          ? "ascending"
                          : "descending"
                        : "none"
                      : undefined
                  }
                >
                  {sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      type="button"
                      className="flex items-center gap-2 px-0 font-semibold hover:bg-transparent"
                      onClick={() => onSort(column.key)}
                    >
                      {column.label}
                      <SortIcon active={isActive} direction={sort.direction} />
                    </Button>
                  ) : (
                    <span className="font-semibold text-foreground">{column.label}</span>
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-6 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            sortedRows.map((row) => (
              <TableRow key={getRowId(row)} className="hover:bg-muted/60">
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.key === ("value" as K) ? "tabular-nums" : undefined}>
                    {column.render ? column.render(row) : column.accessor?.(row)}
                  </TableCell>
                ))}
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
