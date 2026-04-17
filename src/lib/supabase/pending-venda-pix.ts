import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";

export type PendingPixVendaInput = {
  customerName: string;
  email: string;
  phone: string;
  amountCents: number;
  productSummary: string;
  idTransaction: string;
  shippingSummary?: string;
  codigoRastreio?: string; // Novo campo
};

function productLine(p: PendingPixVendaInput): string {
  const base = `${p.productSummary} · Pix · Aguardando pagamento`;
  const ship = p.shippingSummary?.trim();
  if (ship) return `${base} · Entrega: ${ship}`;
  return base;
}

export async function insertPendingPixVenda(
  p: PendingPixVendaInput
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return {
      ok: false,
      error: "SUPABASE_SERVICE_ROLE_KEY não configurada.",
    };
  }

  const tx = p.idTransaction.trim();
  if (!tx) return { ok: false, error: "idTransaction vazio." };

  const line = productLine(p);
  const when = new Date().toISOString();
  const id = crypto.randomUUID();

  // Tenta inserir com o campo de rastreio
  const row = {
    id,
    customer: p.customerName,
    email: p.email,
    telefone: p.phone,
    amount_cents: p.amountCents,
    status: "pendente",
    payment_method: "pix",
    product_name: line,
    date: when,
    pix_id_transaction: tx,
    codigo_rastreio: p.codigoRastreio, // Gravando o código
  };

  const { error } = await admin.from("vendas").insert(row).select("id").maybeSingle();
  
  if (error) {
    console.error("[pending-venda-pix] erro ao inserir:", error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true, id };
}

/** Marca venda como paga */
export async function markPixVendaPaidByGatewayId(
  idTransaction: string
): Promise<{ ok: boolean; updated: number; error?: string }> {
  const id = idTransaction.trim();
  if (!id) return { ok: false, updated: 0, error: "id vazio" };

  const admin = createSupabaseAdminClient();
  if (!admin) return { ok: false, updated: 0, error: "SUPABASE_SERVICE_ROLE_KEY não configurada" };

  const { data, error } = await admin.from("vendas").update({ status: "pago" }).eq("pix_id_transaction", id).select("id");
  
  if (error) return { ok: false, updated: 0, error: error.message };
  return { ok: true, updated: data?.length || 0 };
}

/** Marca venda como cancelada (Pix expirou/falhou) */
export async function markPixVendaCanceledByGatewayId(
  idTransaction: string
): Promise<{ ok: boolean; updated: number; error?: string }> {
  const id = idTransaction.trim();
  if (!id) return { ok: false, updated: 0, error: "id vazio" };

  const admin = createSupabaseAdminClient();
  if (!admin) return { ok: false, updated: 0, error: "SUPABASE_SERVICE_ROLE_KEY não configurada" };

  const { data, error } = await admin.from("vendas").update({ status: "cancelado" }).eq("pix_id_transaction", id).select("id");
  
  if (error) return { ok: false, updated: 0, error: error.message };
  return { ok: true, updated: data?.length || 0 };
}