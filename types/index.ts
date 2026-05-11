export type BusinessType =
  | "clinic"
  | "hospital"
  | "pharmacy"
  | "dental"
  | "lab"
  | "retail"
  | "restaurant"
  | "other";

export type TransactionStatus = "pending" | "confirmed" | "failed";
export type Currency = "SOL" | "USDT";

export interface Merchant {
  id: string;
  user_id: string;
  name: string;
  business_type: BusinessType;
  location: string;
  wallet_address: string;
  logo_url?: string;
  description?: string;
  phone?: string;
  email?: string;
  is_active: boolean;
  twende_discount: number;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  merchant_id: string;
  amount: number;
  currency: Currency;
  ugx_equivalent?: number;
  tx_signature?: string;
  payer_wallet?: string;
  payer_name?: string;
  status: TransactionStatus;
  note?: string;
  created_at: string;
  merchant?: Merchant;
}

export interface DashboardStats {
  total_sol: number;
  total_usdt: number;
  total_transactions: number;
  transactions_today: number;
  estimated_ugx: number;
}

export interface PriceData {
  SOL: number;
  USDT: number;
}
