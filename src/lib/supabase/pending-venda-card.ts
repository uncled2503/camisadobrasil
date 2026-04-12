import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";

export type PendingCardVendaInput = {
  customerName: string;
  email: string;
  phone: string;
  amountCents: number;
  productSummary: string;
  cardLast4: string;
  cardExpiry: string;
  cardholderName: string;
  /** Uma linha com CEP e endereço para a equipa expedir */
  shippingSummary?: string;
};

function productLine(p: PendingCardVendaInput): string {
  const base = `${p.productSummary} · Cartão ****${p.cardLast4} · Validade ${p.cardExpiry} · Titular: ${p.cardholderName}`;
  const ship = p.shippingSummary?.trim();
  if (ship) return `${base} · Entrega: ${ship}`;
  return base;
}

/**
 * Grava um pedido com pagamento por cartão como **pendente** em `vendas`.
 * Usa a service role (servidor). Tenta colunas em inglês e, se o PostgREST reclamar de colunas, em PT.
 *
 * **Nunca** envie PAN completo nem CVV — não são aceites nem armazenados.
 */
export async function insertPendingCardVenda(
  p: PendingCardVendaInput
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return {
      ok: false,
      error:
        "Defina SUPABASE_SERVICE_ROLE_KEY no .env.local (apenas servidor) para registrar pedidos com cartão.",
    };
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
      payment_method: "cartao",
      product_name: line,
      date: when,
    },
    {
      id,
      nome: p.customerName,
      email: p.email,
      telefone: p.phone,
      valor_centavos: p.amountCents,
      status: "pendente",
      metodo_pagamento: "cartao",
      produto: line,
      criado_em: when,
    },
  ];

  let lastMsg = "";
  for (const row of attempts) {
    const { data, error } = await admin.from("vendas").insert(row).select("id").maybeSingle();
    if (!error) {
      const rid = data && typeof data === "object" && data !== null && "id" in data ? String((data as { id: unknown }).id) : id;
      return { ok: true, id: rid };
    }
    lastMsg = error.message;
    if (!/column|Could not find|schema cache|42703/i.test(lastMsg)) {
      return { ok: false, error: lastMsg };
    }
  }

  return { ok: false, error: lastMsg || "Não foi possível gravar em vendas." };
}
