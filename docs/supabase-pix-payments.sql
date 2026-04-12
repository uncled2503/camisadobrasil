-- Tabela para o webhook Royal Banking marcar Pix como pago (confirmação no checkout).
-- Executa no Supabase → SQL Editor (uma vez). Na Vercel: SUPABASE_SERVICE_ROLE_KEY.
-- Para ligar ao painel (vendas): executa também `docs/supabase-vendas-pix.sql`.

create table if not exists public.pix_gateway_payments (
  id_transaction text primary key,
  status text not null default 'pending',
  raw_payload jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists pix_gateway_payments_updated_at_idx
  on public.pix_gateway_payments (updated_at desc);

-- Sem políticas = ninguém via API pública (anon/authenticated); só service role (servidor) acede.
alter table public.pix_gateway_payments enable row level security;
