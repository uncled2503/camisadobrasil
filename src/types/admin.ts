/**
 * Modelos do painel administrativo.
 * Mapeamento sugerido no Supabase:
 * - `leads` → tabela `leads` (status enum, origem enum ou texto)
 * - `sales` → `orders` ou `sales`
 * - `clients` → view/materialização a partir de pedidos ou tabela `customers`
 * - KPIs / séries → views ou RPC agregando as tabelas acima
 */

/** Enum sugerido: `lead_status` no Postgres. */
export type LeadStatus = "novo" | "em_contato" | "convertido" | "perdido";

/** Enum sugerido: `order_status` no Postgres. */
export type OrderStatus = "pago" | "pendente" | "cancelado";

/** Enum sugerido: `payment_method` no Postgres. */
export type PaymentMethod = "pix" | "cartao" | "boleto" | "pendente";

/** Canal de aquisição — `lead_source` ou coluna texto indexada. */
export type LeadSource =
  | "instagram"
  | "facebook"
  | "google"
  | "whatsapp"
  | "indicacao"
  | "site"
  | "tiktok"
  | "outro";

export type Lead = {
  id: string;
  name: string;
  email: string;
  /** Formato brasileiro com DDD, ex. (11) 98765-4321 */
  phone: string;
  /** Nome do município (sem UF). */
  city: string;
  /** Sigla da UF, ex. SP, RJ. */
  state: string;
  source: LeadSource;
  productInterest: string;
  status: LeadStatus;
  /** ISO 8601 */
  createdAt: string;
};

export type Sale = {
  id: string;
  customer: string;
  email: string;
  phone?: string;
  amountCents: number;
  status: OrderStatus;
  /** ISO 8601 */
  date: string;
  productName: string;
  paymentMethod: PaymentMethod;
};

export type Client = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  ordersCount: number;
  lifetimeCents: number;
  /** ISO 8601 */
  lastOrderAt: string;
};

/**
 * KPIs da tela de clientes — podem vir de view/materialização (`customer_stats`) no Supabase.
 */
export type ClientsAggregateMetrics = {
  totalClients: number;
  /** Clientes com mais de um pedido. */
  recurringClients: number;
  /** Receita total ÷ quantidade total de pedidos (média por pedido na base). */
  averageTicketCents: number;
  /** Soma do valor total gasto (LTV agregado). */
  totalLifetimeCents: number;
};

/**
 * Agregados do dashboard — espelho de uma view/RPC no Supabase.
 * `revenueMonthCents` considera apenas pedidos com status `pago` (receita reconhecida).
 */
/** Contagem por status no conjunto de leads carregado (painel). */
export type LeadStatusCounts = Record<LeadStatus, number>;

/** Contagem por status de pagamento no conjunto de vendas carregado. */
export type OrderStatusCounts = Record<OrderStatus, number>;

export type DashboardKpis = {
  revenueMonthCents: number;
  /** Todos os pedidos do período (inclui pendente / cancelado). */
  ordersMonth: number;
  paidOrdersMonth: number;
  /** Ticket médio sobre pedidos pagos. */
  averageTicketCents: number;
  newLeadsWeek: number;
  totalLeads: number;
  /** % de leads com status `convertido` (métrica de funil mock). */
  conversionRate: number;
  /** Quantidade de leads com status `convertido`. */
  convertedLeadsCount: number;
  /** Distribuição de status na base carregada (até o limite do Supabase). */
  leadStatusCounts: LeadStatusCounts;
  /** Distribuição de status de pagamento na base de vendas carregada. */
  orderStatusCounts: OrderStatusCounts;
};

/** Série genérica em centavos (ex. receita diária). */
export type RevenueDayPoint = {
  label: string;
  valueCents: number;
};

export type SalesPerformancePoint = {
  label: string;
  valueCents: number;
};
