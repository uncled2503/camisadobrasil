/** Mínimo em reais para Pix Cash In na Royal Banking (evita `validation.min.numeric` no upstream). */
export const ROYAL_BANKING_MIN_PIX_AMOUNT_BRL = 1;

export function formatRoyalBankingMinPixAmountPt(): string {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    ROYAL_BANKING_MIN_PIX_AMOUNT_BRL
  );
}

export function isPixAmountBelowGatewayMin(amountBrl: number): boolean {
  return Math.round(amountBrl * 100) < Math.round(ROYAL_BANKING_MIN_PIX_AMOUNT_BRL * 100);
}

/** Converte chaves tipo Laravel (`validation.min.numeric`) em texto legível (pt-BR). */
function mapLaravelValidationKey(key: string): string | null {
  if (!key.startsWith("validation.")) return null;
  if (key === "validation.min.numeric" || key === "validation.min") {
    return `O valor do Pix está abaixo do mínimo permitido (${formatRoyalBankingMinPixAmountPt()}). Aumente o total do pedido ou use cartão.`;
  }
  return "O provedor de pagamento recusou os dados. Verifique os valores e tente novamente.";
}

function firstValidationMessageFromErrors(errors: Record<string, unknown>): string | null {
  for (const v of Object.values(errors)) {
    const parts = Array.isArray(v) ? v : [v];
    for (const p of parts) {
      if (typeof p !== "string") continue;
      const m = mapLaravelValidationKey(p.trim());
      if (m) return m;
    }
  }
  return null;
}

/**
 * Interpreta corpo de erro do gateway (ex. Laravel) e devolve mensagem para o utilizador.
 */
export function humanizePixGatewayError(data: unknown): string | null {
  if (typeof data !== "object" || data === null || Array.isArray(data)) return null;
  const o = data as Record<string, unknown>;

  const errors = o.errors;
  if (errors && typeof errors === "object" && !Array.isArray(errors)) {
    const fromFields = firstValidationMessageFromErrors(errors as Record<string, unknown>);
    if (fromFields) return fromFields;
  }

  if (typeof o.message === "string") {
    const m = mapLaravelValidationKey(o.message.trim());
    if (m) return m;
  }
  if (typeof o.error === "string") {
    const m = mapLaravelValidationKey(o.error.trim());
    if (m) return m;
  }

  return null;
}

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
