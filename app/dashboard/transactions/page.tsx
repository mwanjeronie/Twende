import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { TransactionsTable } from "@/components/dashboard/transactions-table";

export default async function TransactionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: merchant } = await supabase
    .from("merchants")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!merchant) redirect("/register");

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("merchant_id", merchant.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <DashboardHeader title="Transactions" subtitle="All payments received through Twende" />
      <div className="p-6">
        <TransactionsTable transactions={transactions ?? []} />
      </div>
    </div>
  );
}
