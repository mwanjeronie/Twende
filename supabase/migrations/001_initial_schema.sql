-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- MERCHANTS TABLE
-- ==========================================
create table if not exists public.merchants (
  id            uuid primary key default uuid_generate_v4(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  name          text not null,
  business_type text not null check (business_type in ('clinic','hospital','pharmacy','dental','lab','retail','restaurant','other')),
  location      text not null,
  wallet_address text not null,
  logo_url      text,
  description   text,
  phone         text,
  email         text,
  is_active     boolean not null default true,
  twende_discount integer not null default 30 check (twende_discount >= 0 and twende_discount <= 100),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Index for fast user lookups
create index if not exists merchants_user_id_idx on public.merchants(user_id);
-- Index for active merchants
create index if not exists merchants_is_active_idx on public.merchants(is_active) where is_active = true;

-- ==========================================
-- TRANSACTIONS TABLE
-- ==========================================
create table if not exists public.transactions (
  id             uuid primary key default uuid_generate_v4(),
  merchant_id    uuid not null references public.merchants(id) on delete cascade,
  amount         numeric(18, 6) not null check (amount > 0),
  currency       text not null check (currency in ('SOL', 'USDT')),
  ugx_equivalent numeric(18, 2),
  tx_signature   text unique,
  payer_wallet   text,
  payer_name     text,
  status         text not null default 'pending' check (status in ('pending', 'confirmed', 'failed')),
  note           text,
  created_at     timestamptz not null default now()
);

-- Indexes for performance
create index if not exists transactions_merchant_id_idx on public.transactions(merchant_id);
create index if not exists transactions_status_idx on public.transactions(status);
create index if not exists transactions_created_at_idx on public.transactions(created_at desc);

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================

-- Merchants: enable RLS
alter table public.merchants enable row level security;

-- Merchants: owner can do everything
create policy "merchants_owner_all" on public.merchants
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Merchants: anyone can read active merchants (for payment pages)
create policy "merchants_public_read" on public.merchants
  for select using (is_active = true);

-- Transactions: enable RLS
alter table public.transactions enable row level security;

-- Transactions: merchant owners can read their own transactions
create policy "transactions_owner_read" on public.transactions
  for select using (
    merchant_id in (
      select id from public.merchants where user_id = auth.uid()
    )
  );

-- Transactions: anyone can insert (customers paying)
-- The merchant_id must correspond to an active merchant
create policy "transactions_public_insert" on public.transactions
  for insert with check (
    merchant_id in (
      select id from public.merchants where is_active = true
    )
  );

-- ==========================================
-- AUTO-UPDATE updated_at
-- ==========================================
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger merchants_updated_at
  before update on public.merchants
  for each row execute procedure public.handle_updated_at();

-- ==========================================
-- SEED: Demo partner businesses
-- ==========================================
-- Note: These are inserted without user_id for demo purposes.
-- In production, each business registers with their own account.
-- The wallet addresses below are placeholder addresses.

comment on table public.merchants is 'Registered Twende merchant businesses';
comment on table public.transactions is 'Payment transactions processed through Twende';
