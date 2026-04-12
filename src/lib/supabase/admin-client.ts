import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente com service role para operações de escrita no admin (servidor apenas).
 * Sem esta variável, tentativas de update usam a anon key — exige RLS permissiva ou falha.
 */
export function createSupabaseAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
