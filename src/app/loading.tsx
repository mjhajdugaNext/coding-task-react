import { AccountsTableSkeleton } from "@/components/accounts/accounts-skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container space-y-6 py-10">
        <AccountsTableSkeleton />
      </div>
    </main>
  );
}
