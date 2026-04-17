import "server-only";

import { supabase } from "@/lib/supabase";
import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";
import type { LeadStatus } from "@/types/admin";

const ALLOWED: LeadStatus[] = ["novo", "em_contato", "convertido", "perdido"];

export type UpdateLeadStatusResult = { ok: true } | { ok: false; error: string };

export async function updateLeadStatus(leadId: string, status: LeadStatus): Promise<UpdateLeadStatusResult> {
  const id = leadId.trim();
  if (!id) return { ok: false, error: "Identificador do lead inválido." };
  if (!ALLOWED.includes(status)) return { ok: false, error: "Status inválido." };

  const admin = createSupabaseAdminClient();
  const client = admin || supabase;

  const { data, error } = await client.from("leads").update({ status }).eq("id", id).select("id").maybeSingle();

  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: "Lead não encontrado." };

  return { ok: true };
}

/** 
 * Encontra o lead específico pela ID (gerada no momento da criação do carrinho) 
 * e atualiza-o para "convertido" (venda fechada).
 */
export async function markLeadConvertedById(id: string): Promise<{ ok: boolean; error?: string }> {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY não configurada." };
  }

  const { error } = await admin.from("leads").update({ status: "convertido" }).eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  return { ok: true };
}