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
};

function productLine(p: PendingPixVendaInput): string {
  const base = `${p.productSummary} · Pix · Aguardando pagamento`;
  const ship = p.shippingSummary?.trim();
  if (ship) return `${base} · Entrega: ${ship}`;
  return base;
}

/**
 * Grava pedido Pix como **pendente** em `vendas`, ligado ao `idTransaction` da Royal Banking.
 * Requer coluna `pix_id_transaction` ou `id_transacao_pix` — ver `docs/supabase-vendas-pix.sql`.
 */
export async function insertPendingPixVenda(
  p: PendingPixVendaInput
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return {
      ok: false,
      error:
        "SUPABASE_SERVICE_ROLE_KEY não configurada — não foi possível registar a venda Pix no painel.",
    };
  }

  const tx = p.idTransaction.trim();
  if (!tx) {
    return { ok: false, error: "idTransaction vazio." };
  }

  const line = productLine(p);
  const when = new Date().toISOString();
  const id = crypto.randomUUID();

  const attempts: Record<string, unknown>[] = [
    {
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
    },
    {
      id,
      nome: p.customerName,
      email: p.email,
      telefone: p.phone,
      valor_centavos: p.amountCents,
      status: "pendente",
      metodo_pagamento: "pix",
      produto: line,
      criado_em: when,
      id_transacao_pix: tx,
    },
  ];

  let lastMsg = "";
  for (const row of attempts) {
    const { data, error } = await admin.from("vendas").insert(row).select("id").maybeSingle();
    if (!error) {
      const rid =
        data && typeof data === "object" && data !== null && "id" in data
          ? String((data as { id: unknown }).id)
          : id;
      return { ok: true, id: rid };
    }
    lastMsg = error.message;
    if (!/column|Could not find|schema cache|42703/i.test(lastMsg)) {
      return { ok: false, error: lastMsg };
    }
  }

  return { ok: false, error: lastMsg || "Não foi possível gravar a venda Pix em vendas." };
}

/**
 * Marca venda como paga quando o webhook Cash In confirma o Pix.
 * Idempotente: várias chamadas com o mesmo id são seguras.
 */
export async function markPixVendaPaidByGatewayId(
  idTransaction: string
): Promise<{ ok: boolean; updated: number; error?: string }> {
  const id = idTransaction.trim();
  if (!id) return { ok: false, updated: 0, error: "id vazio" };

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return { ok: false, updated: 0, error: "SUPABASE_SERVICE_ROLE_KEY não configurada" };
  }

  const patches: Record<string, unknown>[] = [{ status: "pago" }, { status_pagamento: "pago" }];
  const eqCols = ["pix_id_transaction", "id_transacao_pix"];

  for (const patch of patches) {
    for (const col of eqCols) {
      const { data, error } = await admin.from("vendas").update(patch).eq(col, id).select("id");
      if (error) {
        if (/column|Could not find|schema cache|42703/i.test(error.message)) {
          continue;
        }
        return { ok: false, updated: 0, error: error.message };
      }
      if (data && data.length > 0) {
        return { ok: true, updated: data.length };
      }
    }
  }

  return { ok: true, updated: 0 };
}
