/**
 * Pontos de integração futuros com gateway de pagamento Pix.
 * Substituir implementações por chamadas reais à API/checkout.
 */

export type PurchasePayload = {
  size: string;
  quantity: number;
  unitPriceCents: number;
  productId: string;
};

export async function createPixCheckout(
  payload: PurchasePayload
): Promise<{ checkoutId: string }> {
  // TODO: integrar com gateway (ex.: API route Next.js → provedor Pix)
  console.info("[createPixCheckout] placeholder", payload);
  return Promise.resolve({ checkoutId: "pix-placeholder" });
}

export function handleBuyNow(payload: PurchasePayload): void {
  void createPixCheckout(payload).then(({ checkoutId }) => {
    console.info("[handleBuyNow] checkout criado:", checkoutId);
    // TODO: redirecionar para página de Pix ou exibir QR
  });
}
