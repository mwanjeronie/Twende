import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      merchant_id, amount, currency, tx_signature,
      payer_wallet, ugx_equivalent, status, payer_name, note,
    } = body;

    if (!merchant_id || !amount || !currency) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("transactions")
      .insert({
        merchant_id,
        amount: parseFloat(amount),
        currency,
        tx_signature: tx_signature || null,
        payer_wallet: payer_wallet || null,
        payer_name: payer_name || null,
        ugx_equivalent: ugx_equivalent || null,
        status: status || "pending",
        note: note || null,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to record transaction";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const merchantId = searchParams.get("merchant_id");

    const supabase = await createClient();
    let query = supabase.from("transactions").select("*").order("created_at", { ascending: false });

    if (merchantId) {
      query = query.eq("merchant_id", merchantId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch transactions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
