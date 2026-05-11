import { NextResponse } from "next/server";

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana,tether&vs_currencies=usd,ugx",
      { next: { revalidate: 60 } }
    );

    if (!response.ok) throw new Error("Price fetch failed");

    const data = await response.json();
    return NextResponse.json({
      SOL: {
        usd: data.solana?.usd ?? 150,
        ugx: data.solana?.ugx ?? 555000,
      },
      USDT: {
        usd: data.tether?.usd ?? 1,
        ugx: data.tether?.ugx ?? 3700,
      },
    });
  } catch {
    // Fallback prices
    return NextResponse.json({
      SOL: { usd: 150, ugx: 555000 },
      USDT: { usd: 1, ugx: 3700 },
    });
  }
}
