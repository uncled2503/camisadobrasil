-- Tabela `clientes` para o painel /admin/clientes (`fetchAdminClientes` em src/lib/supabase/queries.ts).
-- Executar no Supabase → SQL Editor (uma vez por projeto).
--
-- Colunas em PT-BR: batem com `mapClienteRow` em src/lib/supabase/mappers.ts.
-- O painel lê com a chave anon → RLS precisa de política de SELECT para `anon`
-- (restringe depois se quiseres outro modelo de segurança).

create table if not exists public.clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null default '',
  email text not null default '',
  telefone text not null default '',
  cidade text not null default '',
  total_pedidos integer not null default 0,
  total_gasto_centavos bigint not null default 0,
  ultima_compra timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint clientes_total_pedidos_nonneg check (total_pedidos >= 0),
  constraint clientes_total_gasto_nonneg check (total_gasto_centavos >= 0)
);

comment on table public.clientes is 'Compradores agregados para o painel administrativo.';

create index if not exists clientes_email_idx on public.clientes (lower(email));
create index if not exists clientes_ultima_compra_idx on public.clientes (ultima_compra desc);

alter table public.clientes enable row level security;

-- Leitura pelo PostgREST com JWT `anon` (NEXT_PUBLIC_SUPABASE_ANON_KEY).
drop policy if exists "clientes_select_anon" on public.clientes;
create policy "clientes_select_anon"
  on public.clientes
  for select
  to anon
  using (true);

-- Opcional: se no futuro usares sessão Supabase Auth no painel.
drop policy if exists "clientes_select_authenticated" on public.clientes;
create policy "clientes_select_authenticated"
  on public.clientes
  for select
  to authenticated
  using (true);

-- Inserção/atualização: o serviço com SUPABASE_SERVICE_ROLE_KEY ignora RLS por defeito.
-- Se precisares de escrita com utilizador `authenticated`, acrescenta políticas INSERT/UPDATE.

-- Exemplo manual (opcional):
-- insert into public.clientes (nome, email, telefone, cidade, total_pedidos, total_gasto_centavos)
-- values ('Maria Silva', 'maria@email.com', '(11) 98765-4321', 'São Paulo', 1, 10000);
