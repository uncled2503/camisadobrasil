import type { DashboardKpis, Lead, RevenueDayPoint, SalesPerformancePoint } from "@/types/admin";
import { mockLeads } from "./leads";
import { mockSales } from "./sales";

const REF_NOW = "2026-04-10T23:59:59";

function countLeadsLastDays(leads: Lead[], days: number): number {
  const end = new Date(REF_NOW);
  const start = new Date(end);
  start.setDate(start.getDate() - days);
  return leads.filter((l) => new Date(l.createdAt) >= start).length;
}

/**
 * KPIs derivados dos mocks de `sales` e `leads` — no Supabase virão de SQL agregado.
 */
export const mockDashboardKpis: DashboardKpis = (() => {
  const paid = mockSales.filter((s) => s.status === "pago");
  const revenueMonthCents = paid.reduce((acc, s) => acc + s.amountCents, 0);
  const paidOrdersMonth = paid.length;
  const ordersMonth = mockSales.length;
  const averageTicketCents = paidOrdersMonth > 0 ? Math.round(revenueMonthCents / paidOrdersMonth) : 0;
  const converted = mockLeads.filter((l) => l.status === "convertido").length;
  const conversionRate =
    mockLeads.length > 0 ? Math.round((converted / mockLeads.length) * 1000) / 10 : 0;

  const leadStatusCounts = {
    novo: mockLeads.filter((l) => l.status === "novo").length,
    em_contato: mockLeads.filter((l) => l.status === "em_contato").length,
    convertido: mockLeads.filter((l) => l.status === "convertido").length,
    perdido: mockLeads.filter((l) => l.status === "perdido").length,
  };

  const orderStatusCounts = {
    pago: mockSales.filter((s) => s.status === "pago").length,
    pendente: mockSales.filter((s) => s.status === "pendente").length,
    cancelado: mockSales.filter((s) => s.status === "cancelado").length,
  };

  return {
    revenueMonthCents,
    ordersMonth,
    paidOrdersMonth,
    averageTicketCents,
    newLeadsWeek: countLeadsLastDays(mockLeads, 7),
    totalLeads: mockLeads.length,
    conversionRate,
    convertedLeadsCount: converted,
    leadStatusCounts,
    orderStatusCounts,
  };
})();

/** Série legada (7 dias) — útil para mini widgets; valores fictícios coerentes com a loja. */
export const mockRevenueLast7Days: RevenueDayPoint[] = [
  { label: "Seg", valueCents: 38_200 },
  { label: "Ter", valueCents: 45_600 },
  { label: "Qua", valueCents: 41_800 },
  { label: "Qui", valueCents: 52_100 },
  { label: "Sex", valueCents: 68_400 },
  { label: "Sáb", valueCents: 55_900 },
  { label: "Dom", valueCents: 29_300 },
];

/** Faturamento diário fictício (14 dias) — gráfico principal “por dia”. */
export const mockSalesPerformanceByDay: SalesPerformancePoint[] = [
  { label: "28/03", valueCents: 32_400 },
  { label: "29/03", valueCents: 41_200 },
  { label: "30/03", valueCents: 28_900 },
  { label: "31/03", valueCents: 36_700 },
  { label: "01/04", valueCents: 44_800 },
  { label: "02/04", valueCents: 51_300 },
  { label: "03/04", valueCents: 39_600 },
  { label: "04/04", valueCents: 58_200 },
  { label: "05/04", valueCents: 47_500 },
  { label: "06/04", valueCents: 42_100 },
  { label: "07/04", valueCents: 61_800 },
  { label: "08/04", valueCents: 54_400 },
  { label: "09/04", valueCents: 49_200 },
  { label: "10/04", valueCents: 56_600 },
];

/** Faturamento semanal fictício (8 semanas) — gráfico “por semana”. */
export const mockSalesPerformanceByWeek: SalesPerformancePoint[] = [
  { label: "Sem 1", valueCents: 186_000 },
  { label: "Sem 2", valueCents: 212_400 },
  { label: "Sem 3", valueCents: 198_700 },
  { label: "Sem 4", valueCents: 245_300 },
  { label: "Sem 5", valueCents: 228_900 },
  { label: "Sem 6", valueCents: 267_200 },
  { label: "Sem 7", valueCents: 239_800 },
  { label: "Sem 8", valueCents: 281_500 },
];
