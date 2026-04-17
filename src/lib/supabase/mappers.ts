import type { Client, Lead, LeadSource, LeadStatus, OrderStatus, PaymentMethod, Sale } from "@/types/admin";

function str(v: unknown, fallback = ""): string {
  if (v === null || v === undefined) return fallback;
  return String(v).trim();
}

function num(v: unknown, fallback = 0): number {
  if (typeof v === "number" && !Number.isNaN(v)) return Math.round(v);
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v.replace(",", "."));
    return Number.isFinite(n) ? Math.round(n) : fallback;
  }
  return fallback;
}

function pick(r: Record<string, unknown>, keys: string[]): unknown {
  for (const k of keys) {
    const v = r[k];
    if (v !== null && v !== undefined && v !== "") return v;
  }
  return undefined;
}

const LEAD_STATUSES: LeadStatus[] = ["novo", "em_contato", "convertido", "perdido"];

function normLeadStatus(s: string): LeadStatus {
  const x = s.toLowerCase().replace(/\s+/g, "_");
  if (LEAD_STATUSES.includes(x as LeadStatus)) return x as LeadStatus;
  return "novo";
}

function normOrderStatus(s: string): OrderStatus {
  const x = s.toLowerCase();
  if (x === "pago" || x === "pendente" || x === "cancelado") return x;
  return "pendente";
}

function normPayment(s: string): PaymentMethod {
  const x = s.toLowerCase();
  if (x === "pix" || x === "cartao" || x === "boleto" || x === "pendente") return x;
  return "pendente";
}

const SOURCES: LeadSource[] = [
  "instagram",
  "facebook",
  "google",
  "whatsapp",
  "indicacao",
  "site",
  "tiktok",
  "outro",
];

function normSource(s: string): LeadSource {
  const x = s.toLowerCase() as LeadSource;
  return SOURCES.includes(x) ? x : "outro";
}

function isoDate(v: unknown): string {
  if (v instanceof Date) return v.toISOString();
  const s = str(v);
  if (!s) return new Date(0).toISOString();
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? new Date(0).toISOString() : d.toISOString();
}

export function mapLeadRow(r: Record<string, unknown>): Lead {
  const id = str(pick(r, ["id", "lead_id"]));
  return {
    id: id || `lead-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name: str(pick(r, ["name", "nome", "full_name", "nome_completo"])),
    email: str(pick(r, ["email", "e_mail"])),
    phone: str(pick(r, ["phone", "telefone", "tel", "celular"])),
    city: str(pick(r, ["city", "cidade", "municipio"])),
    state: str(pick(r, ["state", "estado", "uf"])),
    source: normSource(str(pick(r, ["source", "origem", "canal"]))),
    productInterest: str(
      pick(r, ["product_interest", "produto_interesse", "productInterest", "interesse", "produto"])
    ),
    status: normLeadStatus(str(pick(r, ["status"]))),
    createdAt: isoDate(pick(r, ["created_at", "criado_em", "createdAt"])),
    trackingCode: str(pick(r, ["codigo_rastreio", "tracking_code", "trackingCode"])),
  };
}

export function mapVendaRow(r: Record<string, unknown>): Sale {
  const id = str(pick(r, ["id", "pedido_id", "order_id"]));
  const phoneVal = pick(r, ["phone", "telefone", "tel"]);
  return {
    id: id || `PED-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    customer: str(pick(r, ["customer", "cliente", "nome_cliente", "customer_name", "nome"])),
    email: str(pick(r, ["email"])),
    phone: phoneVal !== undefined ? str(phoneVal) : undefined,
    amountCents: num(
      pick(r, ["amount_cents", "amount_centavos", "valor_centavos", "valor_cents", "total_centavos", "valor"])
    ),
    status: normOrderStatus(str(pick(r, ["status", "status_pagamento"]))),
    date: isoDate(pick(r, ["date", "data", "created_at", "criado_em", "pedido_em", "data_pedido"])),
    productName: str(pick(r, ["product_name", "produto", "produto_nome", "item", "descricao"])),
    paymentMethod: normPayment(str(pick(r, ["payment_method", "metodo_pagamento", "forma_pagamento"]))),
    trackingCode: str(pick(r, ["codigo_rastreio", "tracking_code", "trackingCode"])),
  };
}

export function mapClienteRow(r: Record<string, unknown>): Client {
  const id = str(pick(r, ["id", "cliente_id"]));
  return {
    id: id || `CLI-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name: str(pick(r, ["name", "nome", "full_name", "nome_completo"])),
    email: str(pick(r, ["email"])),
    phone: str(pick(r, ["phone", "telefone", "tel"])),
    city: str(pick(r, ["city", "cidade"])),
    ordersCount: Math.max(0, num(pick(r, ["orders_count", "total_pedidos", "pedidos", "qtd_pedidos"]))),
    lifetimeCents: num(
      pick(r, ["lifetime_cents", "total_gasto_centavos", "valor_total_centavos", "ltv_cents", "total_gasto"])
    ),
    lastOrderAt: isoDate(pick(r, ["last_order_at", "ultima_compra", "ultimo_pedido_em", "updated_at"])),
  };
}