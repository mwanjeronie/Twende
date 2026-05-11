import {
  Connection,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  createTransferCheckedInstruction,
  getAssociatedTokenAddress,
  getMint,
} from "@solana/spl-token";

export type SolanaNetwork = "devnet" | "mainnet-beta";

export const NETWORK: SolanaNetwork =
  (process.env.NEXT_PUBLIC_SOLANA_NETWORK as SolanaNetwork) || "devnet";

export const USDT_MINT_ADDRESS = {
  devnet: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  "mainnet-beta": "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
};

export function getConnection(): Connection {
  return new Connection(clusterApiUrl(NETWORK), "confirmed");
}

export function generateSolanaPayUrl({
  recipient,
  amount,
  currency,
  label,
  message,
}: {
  recipient: string;
  amount?: number;
  currency?: "SOL" | "USDT";
  label: string;
  message?: string;
}): string {
  const params = new URLSearchParams();
  if (label) params.set("label", label);
  if (message) params.set("message", message || `Pay ${label} with Twende`);
  if (amount && amount > 0) params.set("amount", amount.toString());
  if (currency === "USDT") {
    params.set("spl-token", USDT_MINT_ADDRESS[NETWORK]);
  }
  return `solana:${recipient}?${params.toString()}`;
}

export function generateMerchantQrUrl(
  walletAddress: string,
  merchantName: string
): string {
  return generateSolanaPayUrl({
    recipient: walletAddress,
    label: merchantName,
    message: `Pay ${merchantName} with Twende`,
  });
}

export async function getSOLBalance(walletAddress: string): Promise<number> {
  const connection = getConnection();
  const pubKey = new PublicKey(walletAddress);
  const balance = await connection.getBalance(pubKey);
  return balance / LAMPORTS_PER_SOL;
}

export async function getUSDTBalance(walletAddress: string): Promise<number> {
  try {
    const connection = getConnection();
    const pubKey = new PublicKey(walletAddress);
    const mintPubKey = new PublicKey(USDT_MINT_ADDRESS[NETWORK]);
    const tokenAccount = await getAssociatedTokenAddress(mintPubKey, pubKey);
    const balance = await connection.getTokenAccountBalance(tokenAccount);
    return Number(balance.value.uiAmount) || 0;
  } catch {
    return 0;
  }
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}
