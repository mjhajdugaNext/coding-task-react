import { Suspense } from "react";

import AccountsTableSection from "@/components/accounts/accounts-table-section";
import { TableSkeleton } from "@/components/ui/table-skeleton";
import {
  PageContainer,
  PageDescription,
  PageEyebrow,
  PageHeader,
  PageShell,
  PageTitle,
  Section,
} from "@/components/ui/layout";

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <PageShell>
      <PageContainer>
        <PageHeader>
          <PageEyebrow>Compliance</PageEyebrow>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <PageTitle>Client Accounts Impacted</PageTitle>
              <PageDescription>
                SSR-fetched accounts enriched with account type dictionary. Sort any column to
                explore the impacted accounts for recent events.
              </PageDescription>
            </div>
          </div>
        </PageHeader>

        <Section>
          <Suspense fallback={<TableSkeleton />}>
            {/* Streaming from server component + client table for interactivity */}
            <AccountsTableSection />
          </Suspense>
        </Section>
      </PageContainer>
    </PageShell>
  );
}
