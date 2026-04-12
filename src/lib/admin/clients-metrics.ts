import type { Client, ClientsAggregateMetrics } from "@/types/admin";

/**
 * Calcula métricas da base de clientes — no servidor, substituir por resultado de RPC/view.
 */
export function computeClientsMetrics(clients: Client[]): ClientsAggregateMetrics {
  if (clients.length === 0) {
    return {
      totalClients: 0,
      recurringClients: 0,
      averageTicketCents: 0,
      totalLifetimeCents: 0,
    };
  }

  const totalClients = clients.length;
  const recurringClients = clients.filter((c) => c.ordersCount > 1).length;
  const totalLifetimeCents = clients.reduce((acc, c) => acc + c.lifetimeCents, 0);
  const totalOrders = clients.reduce((acc, c) => acc + c.ordersCount, 0);
  const averageTicketCents =
    totalOrders > 0 ? Math.round(totalLifetimeCents / totalOrders) : 0;

  return {
    totalClients,
    recurringClients,
    averageTicketCents,
    totalLifetimeCents,
  };
}
