import { AccountsTable } from "@/components/accounts/accounts-table";
import { getAccountView } from "@/lib/data";

export default async function AccountsTableSection() {
  const accounts = await getAccountView();
  return <AccountsTable accounts={accounts} />;
}
