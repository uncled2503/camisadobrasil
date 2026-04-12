/** Formatação e rótulos usados pelo painel /admin */

import type { LeadSource, PaymentMethod } from "@/types/admin";

const paymentLabels: Record<PaymentMethod, string> = {
  pix: "PIX",
  cartao: "Cartão",
  boleto: "Boleto",
  pendente: "Pendente",
};

const leadSourceLabels: Record<LeadSource, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  google: "Google",
  whatsapp: "WhatsApp",
  indicacao: "Indicação",
  site: "Site",
  tiktok: "TikTok",
  outro: "Outro",
};

export function formatPaymentMethod(method: PaymentMethod) {
  return paymentLabels[method] ?? method;
}

export function formatLeadSource(source: LeadSource) {
  return leadSourceLabels[source] ?? source;
}

export function formatBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
}

export function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

/** Texto relativo curto para leitura de “histórico” (ex.: há 2 dias). */
export function formatRelativeTimePt(iso: string, now = new Date()): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.round(diffMs / 60_000);
  const rtf = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

  if (Math.abs(diffMin) < 1) return "agora";
  if (Math.abs(diffMin) < 60) return rtf.format(-diffMin, "minute");

  const diffHr = Math.round(diffMin / 60);
  if (Math.abs(diffHr) < 48) return rtf.format(-diffHr, "hour");

  const diffDay = Math.round(diffHr / 24);
  if (Math.abs(diffDay) < 30) return rtf.format(-diffDay, "day");

  const diffMonth = Math.round(diffDay / 30);
  if (Math.abs(diffMonth) < 12) return rtf.format(-diffMonth, "month");

  return rtf.format(-Math.round(diffMonth / 12), "year");
}
