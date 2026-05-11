import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { MerchantQRCode } from "@/components/payment/merchant-qr-code";

export default async function QRPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: merchant } = await supabase
    .from("merchants")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!merchant) redirect("/register");

  return (
    <div>
      <DashboardHeader title="Payment QR Code" subtitle="Share this with your customers" />
      <div className="p-6">
        <MerchantQRCode merchant={merchant} />
      </div>
    </div>
  );
}
