import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

const SUPABASE_URL = "https://ulrigywayovxuyiktnlr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVscmlneXdheW92eHV5aWt0bmxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NDA5NzcsImV4cCI6MjA5MTQxNjk3N30._rf_5EQ69yPVBeXtlJs-56Nd3y3zpUsdu-L9TDM_un0";

function resolveClient(): SupabaseClient {
  if (client) return client;
  
  client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false }
  });
  return client;
}

/**
 * Cliente anónimo (lazy) para server components.
 */
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const c = resolveClient();
    const value = Reflect.get(c, prop, c) as unknown;
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(c);
    }
    return value;
  },
});