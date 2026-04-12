import "server-only";

/** True quando URL e chave anónima estão definidas (o painel pode falar com o projeto). */
export function isSupabasePublicEnvConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return Boolean(url && key);
}
