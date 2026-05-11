import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { PaymentClient } from "./payment-client";

interface PayPageProps {
  params: Promise<{ merchantId: string }>;
}

export async function generateMetadata({ params }: PayPageProps) {
  const { merchantId } = await params;
  const supabase = await createClient();
  const { data: merchant } = await supabase
    .from("merchants")
    .select("name, location, description")
    .eq("id", merchantId)
    .single();

  if (!merchant) return { title: "Pay — Twende" };

  return {
    title: `Pay ${merchant.name} — Twende`,
    description: `Pay ${merchant.name} in ${merchant.location} using SOL or USDT via Twende`,
  };
}

export default async function PayPage({ params }: PayPageProps) {
  const { merchantId } = await params;
  const supabase = await createClient();
  const { data: merchant } = await supabase
    .from("merchants")
    .select("*")
    .eq("id", merchantId)
    .eq("is_active", true)
    .single();

  if (!merchant) notFound();

  return <PaymentClient merchant={merchant} />;
}
