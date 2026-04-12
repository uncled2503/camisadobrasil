import type { DashboardKpis, Lead, LeadStatus, OrderStatus, Sale } from "@/types/admin";

const LEAD_STATUSES: LeadStatus[] = ["novo", "em_contato", "convertido", "perdido"];
const ORDER_STATUSES: OrderStatus[] = ["pago", "pendente", "cancelado"];

function emptyLeadStatusCounts(): DashboardKpis["leadStatusCounts"] {
  return { novo: 0, em_contato: 0, convertido: 0, perdido: 0 };
}

function emptyOrderStatusCounts(): DashboardKpis["orderStatusCounts"] {
  return { pago: 0, pendente: 0, cancelado: 0 };
}

/** KPIs do dashboard a partir de listas já carregadas (limite de linhas no Supabase). */
export function computeDashboardKpisFromData(leads: Lead[], vendas: Sale[], now = new Date()): DashboardKpis {
  const y = now.getFullYear();
  const m = now.getMonth();
  const start = new Date(y, m, 1, 0, 0, 0, 0);
  const end = new Date(y, m + 1, 0, 23, 59, 59, 999);

  const vendasMes = vendas.filter((s) => {
    const d = new Date(s.date);
    return !Number.isNaN(d.getTime()) && d >= start && d <= end;
  });

  const paid = vendasMes.filter((s) => s.status === "pago");
  const revenueMonthCents = paid.reduce((acc, s) => acc + s.amountCents, 0);
  const paidOrdersMonth = paid.length;
  const ordersMonth = vendasMes.length;
  const averageTicketCents = paidOrdersMonth > 0 ? Math.round(revenueMonthCents / paidOrdersMonth) : 0;

  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const newLeadsWeek = leads.filter((l) => {
    const d = new Date(l.createdAt);
    return !Number.isNaN(d.getTime()) && d >= weekAgo;
  }).length;

  const converted = leads.filter((l) => l.status === "convertido").length;
  const conversionRate = leads.length > 0 ? Math.round((converted / leads.length) * 1000) / 10 : 0;

  const leadStatusCounts = emptyLeadStatusCounts();
  for (const l of leads) {
    if (LEAD_STATUSES.includes(l.status)) leadStatusCounts[l.status] += 1;
  }

  const orderStatusCounts = emptyOrderStatusCounts();
  for (const s of vendas) {
    if (ORDER_STATUSES.includes(s.status)) orderStatusCounts[s.status] += 1;
  }

  return {
    revenueMonthCents,
    ordersMonth,
    paidOrdersMonth,
    averageTicketCents,
    newLeadsWeek,
    totalLeads: leads.length,
    conversionRate,
    convertedLeadsCount: converted,
    leadStatusCounts,
    orderStatusCounts,
  };
}
