ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS codigo_rastreio TEXT;
ALTER TABLE public.vendas ADD COLUMN IF NOT EXISTS codigo_rastreio TEXT;