import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ulrigywayovxuyiktnlr.supabase.co";

/**
 * Cliente para operações de escrita no admin (Backend/Servidor).
 */
export function createSupabaseAdminClient(): SupabaseClient | null {
  let key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  
  // Limpa aspas caso existam
  if (key && ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'")))) {
    key = key.slice(1, -1).trim();
  }

  if (!key) {
    console.error("[Supabase Admin] Chave secreta ausente. Configure a variável SUPABASE_SERVICE_ROLE_KEY.");
    return null; 
  }

  return createClient(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}