import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function formatCurrency(amount: number, currency: "SOL" | "USDT" | "UGX"): string {
  if (currency === "UGX") {
    return new Intl.NumberFormat("en-UG", {
      style: "currency",
      currency: "UGX",
      minimumFractionDigits: 0,
    }).format(amount);
  }
  return `${amount.toFixed(currency === "SOL" ? 4 : 2)} ${currency}`;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-UG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export const SOLANA_EXPLORER_URL = {
  devnet: "https://explorer.solana.com/tx",
  "mainnet-beta": "https://explorer.solana.com/tx",
};

export function getSolanaExplorerUrl(signature: string, network = "devnet"): string {
  const cluster = network === "devnet" ? "?cluster=devnet" : "";
  return `https://explorer.solana.com/tx/${signature}${cluster}`;
}

export const BUSINESS_TYPES = [
  { value: "clinic", label: "Clinic / Medical Centre" },
  { value: "hospital", label: "Hospital" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "dental", label: "Dental Facility" },
  { value: "lab", label: "Laboratory" },
  { value: "retail", label: "Retail Store" },
  { value: "restaurant", label: "Restaurant / Pub" },
  { value: "other", label: "Other" },
];

export const UGANDA_LOCATIONS = [
  "Kampala - Kawempe", "Kampala - Kisaasi", "Kampala - Kyanja",
  "Kampala - Kamokya", "Kampala - Kololo", "Kampala - Ntinda",
  "Kampala - Nakawa", "Kampala - Makindye", "Mbarara", "Gulu",
  "Mbale", "Kabale", "Jinja", "Entebbe", "Other",
];

export function isValidSolanaAddress(address: string): boolean {
  // Solana addresses are base58-encoded 32-byte public keys (32-44 chars)
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}
