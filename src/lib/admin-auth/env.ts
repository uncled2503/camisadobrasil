/**
 * Leitura de variáveis de ambiente para o guard do admin.
 * Sem dependências de Node — pode ser importado pelo middleware (Edge).
 */

const MIN_SECRET_LEN = 16;

export function readAdminSessionSecret(): string | null {
  const s = process.env.ADMIN_SESSION_SECRET?.trim();
  return s && s.length >= MIN_SECRET_LEN ? s : null;
}

export function readAdminPassword(): string | null {
  const p = process.env.ADMIN_PASSWORD?.trim();
  return p && p.length > 0 ? p : null;
}
