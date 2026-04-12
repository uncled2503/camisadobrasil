/** Rotas do funil pós-compra (upsells → obrigado). Centralizado para evitar typos e facilitar mudanças. */
export const POS_COMPRA = {
  upsellVip: "/pos-compra/upsell-vip",
  upsellCard: "/pos-compra/upsell-card",
  /** Pix só dos adicionais (VIP / card) antes da página de obrigado. */
  pixAddons: "/pos-compra/pix-addons",
  obrigado: "/pos-compra/obrigado",
} as const;

export function posCompraPixAddonsQuery(vip: boolean, card: boolean): string {
  const p = new URLSearchParams();
  if (vip) p.set("vip", "1");
  if (card) p.set("card", "1");
  const s = p.toString();
  return s ? `${POS_COMPRA.pixAddons}?${s}` : POS_COMPRA.pixAddons;
}

export function posCompraObrigadoQuery(vip: boolean, card: boolean): string {
  const p = new URLSearchParams();
  if (vip) p.set("vip", "1");
  if (card) p.set("card", "1");
  const s = p.toString();
  return s ? `${POS_COMPRA.obrigado}?${s}` : POS_COMPRA.obrigado;
}
