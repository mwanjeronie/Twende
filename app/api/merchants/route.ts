import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const supabase = await createClient();

    if (id) {
      const { data, error } = await supabase
        .from("merchants")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .single();
      if (error) return NextResponse.json({ error: "Not found" }, { status: 404 });
      return NextResponse.json({ data });
    }

    const { data, error } = await supabase
      .from("merchants")
      .select("id, name, business_type, location, is_active")
      .eq("is_active", true)
      .order("name");
    if (error) throw error;
    return NextResponse.json({ data });
  } catch (err: unknown) {
    return NextResponse.json({ error: "Failed to fetch merchants" }, { status: 500 });
  }
}
