import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";

export type PendingPixVendaInput = {
  leadId?: string;
  customerName: string;
  amountCents: number;
  productSummary: string;
  idTransaction: string;
  shippingSummary?: string;
};

export async function insertPendingPixVenda(
  p: PendingPixVendaInput
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY não configurada." };
  }

  const tx = p.idTransaction.trim();
  if (!tx) return { ok: false, error: "idTransaction vazio." };

  const base = `${p.productSummary} · Pix`;
  const line = p.shippingSummary ? `${base} · Entrega: ${p.shippingSummary}` : base;
  const id = crypto.randomUUID();

  // Mapeamento EXATO para as colunas da tabela "vendas"
  const row = {
    id,
    lead_id: p.leadId || null,
    cliente_nome: p.customerName,
    produto: line,
    valor: p.amountCents,
    status_pagamento: "pendente",
    pedido_codigo: tx,
  };

  const { error } = await admin.from("vendas").insert(row);
  
  if (error) {
    console.error("[pending-venda-pix] erro ao inserir:", error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true, id };
}

export async function markPixVendaPaidByGatewayId(
  idTransaction: string
): Promise<{ ok: boolean; updated: number; leadId?: string; error?: string }> {
  const id = idTransaction.trim();
  if (!id) return { ok: false, updated: 0, error: "id vazio" };

  const admin = createSupabaseAdminClient();
  if (!admin) return { ok: false, updated: 0, error: "SUPABASE_SERVICE_ROLE_KEY não configurada" };

  const { data, error } = await admin
    .from("vendas")
    .update({ status_pagamento: "pago" })
    .eq("pedido_codigo", id)
    .select("id, lead_id");
  
  if (error) return { ok: false, updated: 0, error: error.message };
  return { ok: true, updated: data?.length || 0, leadId: data?.[0]?.lead_id };
}

export async function markPixVendaCanceledByGatewayId(
  idTransaction: string
): Promise<{ ok: boolean; updated: number; error?: string }> {
  const id = idTransaction.trim();
  if (!id) return { ok: false, updated: 0, error: "id vazio" };

  const admin = createSupabaseAdminClient();
  if (!admin) return { ok: false, updated: 0, error: "SUPABASE_SERVICE_ROLE_KEY não configurada" };

  const { data, error } = await admin
    .from("vendas")
    .update({ status_pagamento: "cancelado" })
    .eq("pedido_codigo", id)
    .select("id");
  
  if (error) return { ok: false, updated: 0, error: error.message };
  return { ok: true, updated: data?.length || 0 };
}