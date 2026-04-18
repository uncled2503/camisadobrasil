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

/**
 * Exclui um lead e todas as suas vendas associadas (via lead_id).
 */
export async function deleteLeadAndRelatedData(leadId: string): Promise<{ ok: boolean; error?: string }> {
  const admin = createSupabaseAdminClient();
  if (!admin) {
    return { ok: false, error: "SUPABASE_SERVICE_ROLE_KEY não configurada." };
  }

  const id = leadId.trim();
  if (!id) return { ok: false, error: "ID inválido." };

  // 1. Excluir vendas vinculadas a este lead
  const { error: vendasError } = await admin.from("vendas").delete().eq("lead_id", id);
  if (vendasError) {
    console.error("[deleteLead] Erro ao excluir vendas:", vendasError.message);
    return { ok: false, error: "Erro ao excluir vendas vinculadas a este lead." };
  }

  // 2. Excluir o lead
  const { error: leadError } = await admin.from("leads").delete().eq("id", id);
  if (leadError) {
    console.error("[deleteLead] Erro ao excluir lead:", leadError.message);
    return { ok: false, error: leadError.message };
  }

  return { ok: true };
}