import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { BusinessProfileForm } from "@/components/dashboard/business-profile-form";

export default async function ProfilePage() {
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
      <DashboardHeader title="Business Profile" subtitle="Manage your business information" />
      <div className="p-6">
        <BusinessProfileForm merchant={merchant} />
      </div>
    </div>
  );
}
