# Twende dApp

**Crypto payments for real businesses in Uganda.** Accept SOL and USDT instantly at your clinic, hospital, or business — with automatic conversion to UGX.

Built on Solana. Made for Kampala.

---

## Features

- **Merchant registration** — sign up with email + connect Solana wallet
- **Solana Pay QR codes** — unique QR for each business, compatible with Phantom
- **Customer payment page** — `/pay/[merchantId]` for direct payments
- **Real-time dashboard** — track transactions, revenue by currency, UGX estimates
- **Full transaction history** — filterable, exportable to CSV
- **Supabase Auth** — email/password authentication with protected routes

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Blockchain | Solana Web3.js + SPL Token |
| Wallets | Phantom, Solflare via `@solana/wallet-adapter` |
| Database | Supabase (Postgres + Auth) |
| Payments | Solana Pay protocol |

## Getting Started

### 1. Clone and install

```bash
npm install
```

### 2. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Run the SQL migration in `supabase/migrations/001_initial_schema.sql` via the Supabase SQL editor
3. Copy your project URL and anon key

### 3. Set environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/register` | Business registration (3-step wizard) |
| `/login` | Sign in |
| `/dashboard` | Merchant overview + stats |
| `/dashboard/qr` | Payment QR code |
| `/dashboard/transactions` | Full transaction history |
| `/dashboard/profile` | Edit business profile |
| `/dashboard/settings` | Account settings |
| `/pay/[merchantId]` | Customer-facing payment page |

## Database Schema

Run `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor.

Tables:
- `merchants` — business profiles (RLS: owners + public read for active)
- `transactions` — payment records (RLS: owner read + public insert)

## Deploying to Production

1. Push to GitHub
2. Connect to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Change `NEXT_PUBLIC_SOLANA_NETWORK` to `mainnet-beta`

---

*Built for the Twende dApp project · Kampala, Uganda*
