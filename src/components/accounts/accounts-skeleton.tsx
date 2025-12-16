import { Skeleton } from "@/components/ui/skeleton";

export function AccountsTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="grid grid-cols-4 gap-4 border-b px-6 py-3 text-sm font-semibold">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="space-y-3 p-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-4 items-center gap-4 rounded-md border px-4 py-3"
          >
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
            
          </div>
        ))}
      </div>
    </div>
  );
}
