const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

export type SortDirection = "asc" | "desc";
export type SortState<K extends string = string> = { column: K; direction: SortDirection };

export type SortableColumnConfig<T, K extends string = string> = {
  key: K;
  accessor?: (row: T) => string | number | undefined | null;
  compare?: (a: T, b: T) => number;
};

function defaultCompare<T>(accessor?: (row: T) => string | number | undefined | null) {
  return (a: T, b: T) => {
    const va = accessor ? accessor(a) : undefined;
    const vb = accessor ? accessor(b) : undefined;

    if (typeof va === "number" && typeof vb === "number") {
      return va - vb;
    }

    return collator.compare(
      va === undefined || va === null ? "" : String(va),
      vb === undefined || vb === null ? "" : String(vb),
    );
  };
}

export function sortRows<T, K extends string = string>(
  rows: T[],
  { column, direction }: SortState<K>,
  columns: Array<SortableColumnConfig<T, K>>,
): T[] {
  const columnConfig = columns.find((config) => config.key === column);
  const comparator =
    columnConfig?.compare ??
    (columnConfig?.accessor ? defaultCompare(columnConfig.accessor) : () => 0);

  const sorted = [...rows].sort(comparator);
  return direction === "desc" ? sorted.reverse() : sorted;
}
