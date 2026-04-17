/** Valores dos upsells pós-compra (centavos BRL), alinhados às cópias das telas. */
export const UPSELL_VIP_CENTS = 100;
export const UPSELL_CARD_CENTS = 100;

export function computeUpsellAddonCents(vipAccepted: boolean, cardAccepted: boolean): number {
  let total = 0;
  if (vipAccepted) total += UPSELL_VIP_CENTS;
  if (cardAccepted) total += UPSELL_CARD_CENTS;
  return total;
}