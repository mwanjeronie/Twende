import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Twende dApp — Crypto Payments for Ugandan Businesses",
  description: "Accept SOL and USDT payments instantly. Built on Solana. Made for Uganda.",
  keywords: ["Solana", "crypto payments", "Uganda", "Kampala", "USDT", "SOL", "Twende"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className={`${geist.variable} antialiased`}>
        <ThemeProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                fontSize: "13px",
                boxShadow: "var(--shadow-md)",
              },
              success: { iconTheme: { primary: "#22D3EE", secondary: "white" } },
              error: { iconTheme: { primary: "#EF4444", secondary: "white" } },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
