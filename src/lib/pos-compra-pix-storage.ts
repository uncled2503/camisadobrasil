/**
 * Dados do comprador para gerar Pix dos adicionais pós-checkout (sessionStorage).
 * Preenchido no checkout ao gerar Pix ou ao seguir para os upsells.
 */

const STORAGE_KEY = "alpha_pos_compra_pix_client_v1";

export type PosCompraPixClient = {
  name: string;
  email: string;
  /** Só dígitos */
  telefone: string;
  /** CPF ou CNPJ só dígitos */
  document: string;
  /** Endereço de entrega (checkout) — opcional para compatibilidade com sessões antigas */
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
};

export function savePosCompraPixClient(c: PosCompraPixClient): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(c));
  } catch {
    /* quota / private mode */
  }
}

export function readPosCompraPixClient(): PosCompraPixClient | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as unknown;
    if (!o || typeof o !== "object") return null;
    const r = o as Record<string, unknown>;
    const name = typeof r.name === "string" ? r.name.trim() : "";
    const email = typeof r.email === "string" ? r.email.trim() : "";
    const telefone = typeof r.telefone === "string" ? r.telefone.replace(/\D/g, "") : "";
    const document = typeof r.document === "string" ? r.document.replace(/\D/g, "") : "";
    if (!name || !email || telefone.length < 10 || (document.length !== 11 && document.length !== 14)) {
      return null;
    }
    return { name, email, telefone, document };
  } catch {
    return null;
  }
}
