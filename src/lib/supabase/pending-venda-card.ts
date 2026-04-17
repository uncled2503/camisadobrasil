import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";

export type PendingCardVendaInput = {
  leadId?: string;
  customerName: string;
  amountCents: number;
  productSummary: string;
  shippingSummary?: string;
};

export async function insertPendingCardVenda(
  p: PendingCardVendaInput
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY não configurada." };
  }

  const line = p.shippingSummary ? `${p.productSummary} · Entrega: ${p.shippingSummary}` : p.productSummary;
  const id = crypto.randomUUID();

  const row = {
    id,
    lead_id: p.leadId || null,
    cliente_nome: p.customerName,
    produto: line,
    valor: p.amountCents,
    status_pagamento: "pendente",
    pedido_codigo: `CARD-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
  };

  const { error } = await admin.from("vendas").insert(row);
  if (error) {
    console.error("[pending-venda-card] erro:", error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true, id };
}