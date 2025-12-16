import type { AccountView, SortState } from "@/lib/data";

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

export function sortAccounts(
  accounts: AccountView[],
  { column, direction }: SortState,
): AccountView[] {
  const sorted = [...accounts].sort((a, b) => {
    switch (column) {
      case "accountTypeLabel":
        return collator.compare(a.accountTypeLabel, b.accountTypeLabel);
      case "value":
        return a.value - b.value;
      case "currency":
        return collator.compare(a.currency, b.currency);
      case "id":
      default:
        return collator.compare(a.id, b.id);
    }
  });

  if (direction === "desc") {
    sorted.reverse();
  }
  return sorted;
}
