/**
 * Evita open redirect: só destinos internos sob /admin (exceto login).
 */
export function sanitizeAdminRedirect(raw: string | undefined | null): string {
  if (!raw || typeof raw !== "string") return "/admin";
  const s = raw.trim();
  if (!s.startsWith("/admin")) return "/admin";
  if (s.startsWith("//")) return "/admin";
  if (s.startsWith("/admin/login")) return "/admin";
  return s;
}
