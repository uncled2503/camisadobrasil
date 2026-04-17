import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";
import type { LeadSource, LeadStatus } from "@/types/admin";

export type InsertCheckoutLeadInput = {
  name: string;
  email: string;
  phoneDigits: string;
  city?: string;
  state?: string;
  productInterest: string;
  source?: LeadSource;
  status?: LeadStatus;
  codigoRastreio?: string;
  cpf?: string; // Novo campo
};

export async function insertCheckoutLead(
  p: InsertCheckoutLeadInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY não configurada." };
  }

  const id = crypto.randomUUID();
  const when = new Date().toISOString();
  const city = (p.city ?? "").trim();
  const state = (p.state ?? "").trim().toUpperCase().slice(0, 2);
  const source: LeadSource = p.source ?? "site";
  const status: LeadStatus = p.status ?? "em_contato";

  const attempts: Record<string, unknown>[] = [
    {
      id,
      name: p.name.trim(),
      email: p.email.trim().toLowerCase(),
      phone: p.phoneDigits.replace(/\D/g, ""),
      city,
      state,
      source,
      product_interest: p.productInterest.trim(),
      status,
      created_at: when,
      codigo_rastreio: p.codigoRastreio,
      cpf: p.cpf, // Gravando CPF no lead
    },
    {
      id,
      nome: p.name.trim(),
      email: p.email.trim().toLowerCase(),
      telefone: p.phoneDigits.replace(/\D/g, ""),
      cidade: city,
      uf: state,
      origem: source,
      produto_interesse: p.productInterest.trim(),
      status,
      criado_em: when,
      codigo_rastreio: p.codigoRastreio,
      cpf: p.cpf,
    },
  ];

  let lastMsg = "";
  for (const row of attempts) {
    const { error } = await admin.from("leads").insert(row).select("id").maybeSingle();
    if (!error) return { ok: true };
    lastMsg = error.message;
    if (!/column|Could not find|schema cache|42703/i.test(lastMsg)) {
      return { ok: false, error: lastMsg };
    }
  }

  return { ok: false, error: lastMsg || "Não foi possível gravar o lead." };
}