/**
 * Dados fictícios do painel — substituir por fetch Supabase / server actions.
 *
 * - `leads.ts` — funil
 * - `sales.ts` — pedidos
 * - `clients.ts` — base de clientes
 * - `dashboard.ts` — KPIs (derivados de leads/sales onde aplicável) + séries do gráfico
 * - `admin-settings.ts` — placeholders da tela de configurações
 */

export {
  mockDashboardKpis,
  mockRevenueLast7Days,
  mockSalesPerformanceByDay,
  mockSalesPerformanceByWeek,
} from "./dashboard";
export { mockLeads } from "./leads";
export { mockSales } from "./sales";
export { mockClients } from "./clients";
export {
  mockStoreProfile,
  mockPanelPreferences,
  mockIntegrationsPreview,
  mockAdminProfile,
} from "./admin-settings";
