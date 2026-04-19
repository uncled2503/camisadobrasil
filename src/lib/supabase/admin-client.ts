import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ulrigywayovxuyiktnlr.supabase.co";

/**
 * Cliente para operações de escrita no admin.
 */
export function createSupabaseAdminClient(): SupabaseClient | null {
  let key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  
  // Limpa aspas caso a chave tenha sido definida com elas na variável de ambiente
  if (key && ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'")))) {
    key = key.slice(1, -1).trim();
  }

  // Verifica se a chave parece um JWT válido (tem de começar por 'ey')
  if (!key || !key.startsWith("ey")) {
    console.error("[Supabase Admin] SUPABASE_SERVICE_ROLE_KEY ausente ou contém um valor falso/inválido.");
    return null; 
  }

  return createClient(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}