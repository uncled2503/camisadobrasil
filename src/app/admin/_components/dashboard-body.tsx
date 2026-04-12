import "server-only";

import { Banknote, Percent, ShoppingBag, Ticket, UserCheck, Users } from "lucide-react";
import {
  AdminStatCard,
  AdminStatCardsGroup,
  AdminDataTable,
  AdminBadge,
  AdminSectionTitle,
  AdminSalesPerformanceChart,
  AdminPaymentBadge,
} from "@/components/admin";
import { AdminDashboardCommercialSummary } from "@/components/admin/admin-dashboard-commercial-summary";
import { AdminErrorBanner } from "@/components/admin/admin-error-banner";
import { AdminLeadQuickContact } from "@/components/admin/admin-lead-quick-contact";
import { mockSalesPerformanceByDay, mockSalesPerformanceByWeek } from "@/data/mock";
import { formatBRL, formatDate, formatDateTime, formatLeadSource, formatRelativeTimePt } from "@/lib/admin-format";
import { cn } from "@/lib/utils";
import { computeDashboardKpisFromData } from "@/lib/supabase/dashboard-kpis";
import { fetchAdminLeads, fetchAdminVendas } from "@/lib/supabase/queries";

export async function AdminDashboardBody() {
  const [leadsRes, vendasRes] = await Promise.all([fetchAdminLeads(), fetchAdminVendas()]);

  const warnings: string[] = [];
  if (!leadsRes.ok) warnings.push(`Leads: ${leadsRes.error}`);
  if (!vendasRes.ok) warnings.push(`Vendas: ${vendasRes.error}`);

  const leads = leadsRes.ok ? leadsRes.data : [];
  const vendas = vendasRes.ok ? vendasRes.data : [];
  const k = computeDashboardKpisFromData(leads, vendas);

  const leadsRecentes = leads.slice(0, 5);
  const pedidosRecentes = vendas.slice(0, 5);

  return (
    <>
      {warnings.length > 0 ? <AdminErrorBanner messages={warnings} /> : null}

      <section>
        <AdminStatCardsGroup columns={3}>
          <AdminStatCard
            label="Faturamento total"
            value={formatBRL(k.revenueMonthCents)}
            hint="Mês corrente (pedidos pagos)"
            icon={Banknote}
          />
          <AdminStatCard
            label="Pedidos no mês"
            value={String(k.ordersMonth)}
            hint={`${k.paidOrdersMonth} pagos · ${k.ordersMonth - k.paidOrdersMonth} outros status`}
            icon={ShoppingBag}
          />
          <AdminStatCard
            label="Ticket médio"
            value={formatBRL(k.averageTicketCents)}
            hint="Média dos pedidos pagos no mês"
            icon={Ticket}
          />
          <AdminStatCard
            label="Total de leads"
            value={String(k.totalLeads)}
            hint={`${k.newLeadsWeek} novos nos últimos 7 dias`}
            icon={Users}
          />
          <AdminStatCard
            label="Taxa de conversão"
            value={`${k.conversionRate}%`}
            hint="Leads convertidos ÷ total na base carregada"
            icon={Percent}
          />
          <AdminStatCard
            label="Leads convertidos"
            value={String(k.convertedLeadsCount)}
            hint="Status “convertido” no funil"
            icon={UserCheck}
          />
        </AdminStatCardsGroup>
      </section>

      <section>
        <AdminDashboardCommercialSummary
          leadStatusCounts={k.leadStatusCounts}
          orderStatusCounts={k.orderStatusCounts}
        />
      </section>

      <section>
        <AdminSalesPerformanceChart byDay={mockSalesPerformanceByDay} byWeek={mockSalesPerformanceByWeek} />
      </section>

      <section>
        <AdminSectionTitle title="Leads recentes" subtitle="Últimos contatos registrados no funil." />
        <AdminDataTable
          getRowKey={(r) => r.id}
          rows={leadsRecentes}
          emptyMessage={
            leadsRes.ok
              ? "Nenhum lead na base ainda."
              : "Não foi possível listar leads. Verifique o aviso acima."
          }
          columns={[
            { key: "name", header: "Nome", cell: (r) => <span className="font-medium">{r.name}</span> },
            { key: "phone", header: "Telefone", cell: (r) => r.phone },
            {
              key: "city",
              header: "Cidade",
              cell: (r) => (
                <span className="max-w-[140px] truncate sm:max-w-[180px]" title={`${r.city} — ${r.state}`}>
                  {r.city} — {r.state}
                </span>
              ),
            },
            {
              key: "productInterest",
              header: "Produto de interesse",
              cell: (r) => (
                <span
                  className="inline-block max-w-[min(100%,14rem)] rounded-lg border border-gold/25 bg-gold/[0.08] px-2.5 py-1.5 text-[13px] font-medium leading-snug text-gold-bright/95 md:max-w-xs"
                  title={r.productInterest}
                >
                  {r.productInterest || "—"}
                </span>
              ),
            },
            { key: "source", header: "Origem", cell: (r) => formatLeadSource(r.source) },
            {
              key: "contact",
              header: "Contato",
              className: "w-[7.5rem]",
              cell: (r) => <AdminLeadQuickContact phone={r.phone} email={r.email} />,
            },
            {
              key: "status",
              header: "Status",
              cell: (r) => <AdminBadge variant="lead" value={r.status} />,
            },
            {
              key: "createdAt",
              header: "Data",
              cell: (r) => <span className="text-muted-foreground">{formatDate(r.createdAt)}</span>,
            },
          ]}
        />
      </section>

      <section>
        <AdminSectionTitle title="Pedidos recentes" subtitle="Últimas transações da loja." />
        <AdminDataTable
          getRowKey={(r) => r.id}
          getRowClassName={(r) =>
            r.status === "pago" ? "bg-emerald-500/[0.06] hover:bg-emerald-500/[0.09]" : undefined
          }
          rows={pedidosRecentes}
          emptyMessage={
            vendasRes.ok
              ? "Nenhum pedido na base ainda."
              : "Não foi possível listar pedidos. Verifique o aviso acima."
          }
          columns={[
            { key: "id", header: "Pedido", cell: (r) => <span className="font-mono text-xs font-medium">{r.id}</span> },
            { key: "customer", header: "Cliente", cell: (r) => <span className="font-medium">{r.customer}</span> },
            {
              key: "productName",
              header: "Produto",
              cell: (r) => <span className="max-w-[200px] truncate md:max-w-md">{r.productName}</span>,
            },
            {
              key: "status",
              header: "Pagamento",
              className: "w-[120px]",
              cell: (r) => <AdminBadge variant="order" value={r.status} />,
            },
            {
              key: "amountCents",
              header: "Valor",
              className: "whitespace-nowrap tabular-nums",
              cell: (r) => (
                <span
                  className={cn(
                    "font-display text-base tracking-tight",
                    r.status === "pago" ? "font-semibold text-gold-bright" : "font-medium text-foreground/90"
                  )}
                >
                  {formatBRL(r.amountCents)}
                </span>
              ),
            },
            {
              key: "paymentMethod",
              header: "Meio",
              cell: (r) => <AdminPaymentBadge method={r.paymentMethod} />,
            },
            {
              key: "date",
              header: "Quando",
              className: "min-w-[9.5rem]",
              cell: (r) => (
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] text-foreground/95">{formatDateTime(r.date)}</span>
                  <span className="text-[11px] leading-tight text-muted-foreground">{formatRelativeTimePt(r.date)}</span>
                </div>
              ),
            },
          ]}
        />
      </section>
    </>
  );
}
