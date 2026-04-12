/** Nome do cookie de sessão do painel (httpOnly, path /admin). */
export const ADMIN_SESSION_COOKIE = "admin_session";

/** Path restrito para o cookie não ir para rotas públicas. */
export const ADMIN_SESSION_COOKIE_PATH = "/admin";

/** Duração da sessão (alinhada ao `exp` assinado no token). */
export const ADMIN_SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7;
