-- Optional: apply when Supabase is configured.
-- RLS: no public policies — server (service role) only.

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  ref text unique not null,
  name text not null,
  phone text not null,
  appliance text not null,
  appliance_type text,
  brand text,
  problem text,
  area text not null,
  address text not null,
  preferred_date text not null,
  slot text not null,
  status text not null default 'new'
    check (status in ('new', 'confirmed', 'visited', 'completed', 'cancelled')),
  source text not null default 'web',
  created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;
