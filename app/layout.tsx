import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Twende dApp — Crypto Payments for Ugandan Businesses",
  description:
    "Accept SOL and USDT payments instantly at your clinic, hospital, or business. Built on Solana. Made for Uganda.",
  keywords: ["Solana", "crypto payments", "Uganda", "Kampala", "USDT", "SOL", "Twende"],
  openGraph: {
    title: "Twende dApp",
    description: "Crypto payments for real businesses in Uganda",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "white" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "white" },
            },
          }}
        />
      </body>
    </html>
  );
}
