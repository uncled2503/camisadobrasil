import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ulrigywayovxuyiktnlr.supabase.co";
// Chave secreta configurada diretamente no backend.
// A diretiva "server-only" acima garante que este ficheiro nunca é enviado para o browser.
const FALLBACK_SECRET_KEY = "sb_secret_mgThre6rEG52SRoBF8XnXQ_R3n7fPTF";

/**
 * Cliente para operações de escrita no admin (Backend/Servidor).
 */
export function createSupabaseAdminClient(): SupabaseClient | null {
  // Tenta ler do ambiente, se falhar ou for inválida, usa a chave segura que forneceu
  let key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || FALLBACK_SECRET_KEY;
  
  // Limpa aspas caso existam
  if (key && ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'")))) {
    key = key.slice(1, -1).trim();
  }

  if (!key) {
    console.error("[Supabase Admin] Chave secreta ausente.");
    return null; 
  }

  return createClient(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}