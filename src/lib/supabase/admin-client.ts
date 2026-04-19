import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ulrigywayovxuyiktnlr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVscmlneXdheW92eHV5aWt0bmxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDA5NzcsImV4cCI6MjA5MTQxNjk3N30._rf_5EQ69yPVBeXtlJs-56Nd3y3zpUsdu-L9TDM_un0";

/**
 * Cliente para operações de escrita no admin.
 */
export function createSupabaseAdminClient(): SupabaseClient | null {
  let key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || SUPABASE_ANON_KEY;
  
  // Limpa aspas caso a chave tenha sido definida com elas na variável de ambiente
  if ((key.startsWith('"') && key.endsWith('"')) || (key.startsWith("'") && key.endsWith("'"))) {
    key = key.slice(1, -1).trim();
  }

  return createClient(SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}