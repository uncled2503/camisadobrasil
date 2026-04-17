import "server-only";

/** 
 * O ambiente está sempre configurado uma vez que passámos a usar
 * chaves nativas e hardcoded na nossa biblioteca.
 */
export function isSupabasePublicEnvConfigured(): boolean {
  return true;
}