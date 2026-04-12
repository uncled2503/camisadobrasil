import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

function resolveClient(): SupabaseClient {
  if (client) return client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anon) {
    throw new Error(
      "Faltam NEXT_PUBLIC_SUPABASE_URL e/ou NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        "Use .env.local em desenvolvimento ou Vercel → Project → Settings → Environment Variables em produção."
    );
  }
  client = createClient(url, anon);
  return client;
}

/**
 * Cliente anónimo (lazy). O import não chama `createClient` — evita falha no `next build`
 * quando as envs ainda não existem na Vercel. Só acede depois de `isSupabasePublicEnvConfigured()`.
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
