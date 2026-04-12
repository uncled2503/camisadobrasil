import "server-only";

import { supabase } from "@/lib/supabase";
import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";
import type { LeadStatus } from "@/types/admin";

const ALLOWED: LeadStatus[] = ["novo", "em_contato", "convertido", "perdido"];

export type UpdateLeadStatusResult = { ok: true } | { ok: false; error: string };

function friendlyUpdateMessage(message: string, code?: string): string {
  if (message.includes("permission denied") || code === "42501") {
    return "Sem permissão para atualizar o status. No Supabase, defina políticas RLS de UPDATE ou configure SUPABASE_SERVICE_ROLE_KEY no servidor (somente .env, nunca no cliente).";
  }
  if (message.includes("relation") && message.includes("does not exist")) {
    return "Tabela leads não encontrada. Confirme o nome da tabela no Supabase.";
  }
  return message || "Não foi possível atualizar o status.";
}

function clientForWrite() {
  const admin = createSupabaseAdminClient();
  if (admin) return admin;
  return supabase;
}

export async function updateLeadStatus(leadId: string, status: LeadStatus): Promise<UpdateLeadStatusResult> {
  const id = leadId.trim();
  if (!id) {
    return { ok: false, error: "Identificador do lead inválido." };
  }
  if (!ALLOWED.includes(status)) {
    return { ok: false, error: "Status inválido." };
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anon) {
    return { ok: false, error: "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY no .env.local." };
  }

  const client = clientForWrite();

  const { data, error } = await client.from("leads").update({ status }).eq("id", id).select("id").maybeSingle();

  if (error) {
    return { ok: false, error: friendlyUpdateMessage(error.message, error.code) };
  }
  if (!data) {
    return { ok: false, error: "Lead não encontrado ou não foi possível confirmar a atualização." };
  }

  return { ok: true };
}
