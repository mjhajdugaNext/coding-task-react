import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  columns?: number;
  rows?: number;
};

export function TableSkeleton({ columns = 4, rows = 6 }: Props) {
  const headerWidths = ["w-24", "w-28", "w-14", "w-12"];
  const cellWidths = ["w-28", "w-24", "w-20", "w-12"];

  const getWidth = (index: number, widths: string[]) =>
    widths[index] ?? widths[widths.length - 1] ?? "w-16";

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="grid grid-cols-4 gap-4 border-b px-6 py-3 text-sm font-semibold">
        {Array.from({ length: columns }).map((_, idx) => (
          <Skeleton key={idx} className={`h-4 ${getWidth(idx, headerWidths)}`} />
        ))}
      </div>
      <div className="space-y-3 p-6">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="grid grid-cols-4 items-center gap-4 rounded-md border px-4 py-3"
          >
            {Array.from({ length: columns }).map((_, colIdx) => (
              <Skeleton key={colIdx} className={`h-4 ${getWidth(colIdx, cellWidths)}`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
