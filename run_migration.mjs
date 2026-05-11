import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";

const supabase = createClient(
  "https://ayiobmiagiiyevtzyrqt.supabase.co",
  "sb_secret_-5whXCnsODaUl7pGO0VY4w_BdaKY1Tm",
  { auth: { persistSession: false } }
);

// Test connection first
const { data, error } = await supabase.from("merchants").select("count").limit(1);
console.log("Connection test:", error ? error.message : "connected (no table yet = " + JSON.stringify(error) + ")");

// Try exec via rpc
const { data: d2, error: e2 } = await supabase.rpc("exec_sql", { sql: "SELECT 1" });
console.log("RPC test:", e2 ? e2.message : JSON.stringify(d2));
