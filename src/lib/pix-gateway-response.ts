/**
 * Normaliza respostas do gateway Royal Banking (campos podem variar).
 */
export function extractPixGatewayPayload(data: Record<string, unknown>): {
  paymentCode: string;
  paymentCodeBase64: string;
  idTransaction?: string;
} {
  const paymentCode = String(
    data.paymentCode ?? data.payment_code ?? data.copyPaste ?? data.emv ?? ""
  ).trim();

  const rawB64 = data.paymentCodeBase64 ?? data.payment_code_base64 ?? data.qrCodeBase64 ?? data.qrcode;
  const paymentCodeBase64 =
    rawB64 == null ? "" : String(rawB64).trim().replace(/\s/g, "");

  const idRaw = data.idTransaction ?? data.id_transaction ?? data.transactionId;
  const idTransaction = idRaw == null ? undefined : String(idRaw);

  return { paymentCode, paymentCodeBase64, idTransaction };
}

/** Base64 puro ou já `data:image/...;base64,...` — adequado para `img[src]`. */
export function qrDataUrlForImg(raw: string): string | null {
  if (!raw.trim()) return null;
  const s = raw.trim().replace(/\s/g, "");
  if (s.startsWith("data:")) return s;
  return `data:image/png;base64,${s}`;
}
