import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";
import type { LeadSource, LeadStatus } from "@/types/admin";

export type InsertCheckoutLeadInput = {
  id?: string;
  name: string;
  email: string;
  phoneDigits: string;
  city?: string;
  state?: string;
  productInterest: string;
  source?: LeadSource;
  status?: LeadStatus;
  cpf?: string;
};

export async function insertCheckoutLead(
  p: InsertCheckoutLeadInput
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY não configurada." };
  }

  const id = p.id || crypto.randomUUID();
  
  // Mapeamento EXATO para as colunas da tabela "leads"
  const row = {
    id,
    nome: p.name.trim(),
    email: p.email.trim().toLowerCase(),
    telefone: p.phoneDigits.replace(/\D/g, ""),
    cidade: (p.city ?? "").trim(),
    estado: (p.state ?? "").trim().toUpperCase().slice(0, 2),
    origem: p.source ?? "site",
    produto_interesse: p.productInterest.trim(),
    status: p.status ?? "em_contato",
    cpf: p.cpf,
  };

  const { error } = await admin.from("leads").insert(row);
  
  if (error) {
    console.error("[insertCheckoutLead] Erro ao gravar:", error.message);
    return { ok: false, error: error.message };
  }

  return { ok: true, id };
}