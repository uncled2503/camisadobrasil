-- Tabela `leads` para o painel /admin/leads e gravação automática no checkout (Pix + cartão).
-- Executar no Supabase → SQL Editor (uma vez). O app insere com SUPABASE_SERVICE_ROLE_KEY.
-- Leitura no painel usa a chave anon → política SELECT para `anon`.

create table if not exists public.leads (
  id uuid primary key,
  name text not null default '',
  email text not null default '',
  phone text not null default '',
  city text not null default '',
  state text not null default '',
  source text not null default 'site',
  product_interest text not null default '',
  status text not null default 'em_contato',
  created_at timestamptz not null default now()
);

comment on table public.leads is 'Funil de contactos; checkout grava linhas com status em_contato.';

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_email_idx on public.leads (lower(email));

alter table public.leads enable row level security;

drop policy if exists "leads_select_anon" on public.leads;
create policy "leads_select_anon"
  on public.leads
  for select
  to anon
  using (true);

drop policy if exists "leads_select_authenticated" on public.leads;
create policy "leads_select_authenticated"
  on public.leads
  for select
  to authenticated
  using (true);
