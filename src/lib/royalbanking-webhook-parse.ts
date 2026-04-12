/**
 * Interpreta webhooks Royal Banking (Cash In / Cash Out).
 * Cash In pago: `status` = `paid` (ex.: { idTransaction, status: "paid" }).
 * Cash Out: `SaquePago`, `SaqueFalhou` — não marcam depósito Pix no checkout.
 */

const PAID_HINTS = [
  "paid",
  "pago",
  "paga",
  "approved",
  "confirm",
  "success",
  "conclu",
  "liquid",
  "aprov",
  "completed",
];

function norm(s: unknown): string {
  return String(s ?? "")
    .trim()
    .toLowerCase();
}

function looksPaidStatus(s: string): boolean {
  if (!s) return false;
  return PAID_HINTS.some((h) => s.includes(h));
}

/** Cash Out / eventos que não são confirmação de depósito (Cash In). */
function isCashOutOrNonDepositEvent(status: string): boolean {
  if (!status) return false;
  if (status.includes("saque")) return true;
  if (status === "saquepago" || status === "saquefalhou") return true;
  return false;
}

function pickTransactionId(r: Record<string, unknown>): string | undefined {
  const raw =
    r.externalReference ??
    r.external_reference ??
    r.idTransaction ??
    r.id_transaction ??
    r.transactionId ??
    r.transaction_id ??
    r.id ??
    r.txId ??
    r.tx_id;
  if (raw == null || raw === "") return undefined;
  return String(raw).trim();
}

function deepFindId(o: unknown, depth = 0): string | undefined {
  if (depth > 6 || o == null) return undefined;
  if (typeof o !== "object") return undefined;
  const r = o as Record<string, unknown>;
  const id = pickTransactionId(r);
  if (id) return id;
  for (const v of Object.values(r)) {
    if (typeof v === "object" && v !== null) {
      const inner = deepFindId(v, depth + 1);
      if (inner) return inner;
    }
  }
  return undefined;
}

/**
 * Indica se o webhook é confirmação de **Pix Cash In** pago (depósito), não saque.
 */
function isPixCashInPaid(r: Record<string, unknown>): boolean {
  const status = norm(r.status ?? r.payment_status ?? r.paymentStatus ?? r.state);
  if (isCashOutOrNonDepositEvent(status)) return false;
  if (status === "paid") return true;
  if (r.paid === true && !isCashOutOrNonDepositEvent(status)) return true;
  const ev = norm(r.event);
  if (ev === "payment.confirmed" || (ev.includes("paid") && !ev.includes("saque"))) return true;
  if (looksPaidStatus(status)) return true;
  return false;
}

function deepCashInPaid(o: unknown, depth = 0): boolean {
  if (depth > 6 || o == null || typeof o !== "object") return false;
  const r = o as Record<string, unknown>;
  if (isPixCashInPaid(r)) return true;
  for (const v of Object.values(r)) {
    if (typeof v === "object" && v !== null && deepCashInPaid(v, depth + 1)) return true;
  }
  return false;
}

export function parseRoyalBankingPixWebhook(payload: unknown): { idTransaction?: string; paid: boolean } {
  if (payload == null || typeof payload !== "object") {
    return { paid: false };
  }
  const root = payload as Record<string, unknown>;
  const idTransaction = deepFindId(payload);
  const paid = deepCashInPaid(payload);
  if (!paid && idTransaction && isCashOutOrNonDepositEvent(norm(root.status))) {
    return { idTransaction, paid: false };
  }
  return { idTransaction, paid };
}
