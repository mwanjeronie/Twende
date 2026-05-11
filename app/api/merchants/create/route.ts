import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the authenticated user from the session
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { name, business_type, location, phone, wallet_address, description } = body;

    if (!name || !business_type || !location || !wallet_address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if merchant already exists for this user
    const { data: existing } = await supabase
      .from("merchants")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (existing) {
      return NextResponse.json({ data: existing }, { status: 200 });
    }

    const { data, error } = await supabase
      .from("merchants")
      .insert({
        user_id: user.id,
        name,
        business_type,
        location,
        phone: phone || null,
        wallet_address,
        description: description || null,
        is_active: true,
        twende_discount: 30,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create merchant";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
