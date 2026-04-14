-- Tabela `vendas` — pedidos no painel /admin/vendas e gravação em `/api/pix/create` + cartão.
-- O repo tinha só `supabase-vendas-pix.sql` (ALTER), que falha se `vendas` ainda não existir.
-- Executar no Supabase → SQL Editor (uma vez). Depois: `supabase-pix-payments.sql` e, se quiseres, `supabase-vendas-pix.sql` (idempotente).
--
-- Gravação usa SUPABASE_SERVICE_ROLE_KEY (ignora RLS). Leitura no painel usa a chave anon → política SELECT abaixo.

create table if not exists public.vendas (
  id uuid primary key,
  customer text not null default '',
  email text not null default '',
  telefone text not null default '',
  amount_cents bigint not null default 0,
  status text not null default 'pendente',
  payment_method text,
  product_name text,
  "date" timestamptz not null default now(),
  pix_id_transaction text,
  id_transacao_pix text
);

comment on table public.vendas is 'Pedidos da loja (Pix/cartão) para o painel admin.';

create index if not exists vendas_date_idx on public.vendas ("date" desc);
create index if not exists vendas_pix_id_transaction_idx
  on public.vendas (pix_id_transaction)
  where pix_id_transaction is not null;
create index if not exists vendas_id_transacao_pix_idx
  on public.vendas (id_transacao_pix)
  where id_transacao_pix is not null;

alter table public.vendas enable row level security;

drop policy if exists "vendas_select_anon" on public.vendas;
create policy "vendas_select_anon"
  on public.vendas
  for select
  to anon
  using (true);

drop policy if exists "vendas_select_authenticated" on public.vendas;
create policy "vendas_select_authenticated"
  on public.vendas
  for select
  to authenticated
  using (true);
