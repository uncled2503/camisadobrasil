"use client";

import { useDeferredValue, useEffect, useMemo, useState, useTransition } from "react";
import { Users, UserRoundCheck, Ticket, Wallet } from "lucide-react";
import { AdminDataTable } from "@/components/admin/admin-data-table";
import { AdminSectionTitle } from "@/components/admin/admin-section-title";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import { AdminStatCardsGroup } from "@/components/admin/admin-stat-cards-group";
import { AdminSearchField } from "@/components/admin/admin-search-field";
import { AdminFilterSelect, type AdminSelectOption } from "@/components/admin/admin-filter-select";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminTableLoadingOverlay } from "@/components/admin/admin-table-loading-overlay";
import {
  DEFAULT_CLIENTS_PAGE_SIZE,
  filterClientsBySearch,
  sortClientsList,
  type ClientSortOption,
} from "@/lib/admin/clients-list";
import { paginateList } from "@/lib/admin/paginate-list";
import { formatBRL, formatDateTime } from "@/lib/admin-format";
import type { Client, ClientsAggregateMetrics } from "@/types/admin";

const SORT_OPTIONS: AdminSelectOption<ClientSortOption>[] = [
  { value: "last_purchase_desc", label: "Última compra (mais recente)" },
  { value: "last_purchase_asc", label: "Última compra (mais antiga)" },
  { value: "spent_desc", label: "Total gasto (maior)" },
  { value: "spent_asc", label: "Total gasto (menor)" },
];

type AdminClientsViewProps = {
  clients: Client[];
  metrics: ClientsAggregateMetrics;
};

export function AdminClientsView({ clients, metrics }: AdminClientsViewProps) {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const searchPending = search !== deferredSearch;

  const [sort, setSort] = useState<ClientSortOption>("last_purchase_desc");
  const [page, setPage] = useState(1);
  const [uiPending, startTransition] = useTransition();

  const filtered = useMemo(() => filterClientsBySearch(clients, deferredSearch), [clients, deferredSearch]);
  const sorted = useMemo(() => sortClientsList(filtered, sort), [filtered, sort]);

  const { items, total, page: safePage, pageSize, totalPages } = useMemo(
    () => paginateList(sorted, page, DEFAULT_CLIENTS_PAGE_SIZE),
    [sorted, page]
  );

  const listLoading = searchPending || uiPending;

  useEffect(() => {
    setPage(1);
  }, [deferredSearch, sort]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const recurringPct =
    metrics.totalClients > 0 ? Math.round((metrics.recurringClients / metrics.totalClients) * 100) : 0;

  const emptyMessage = useMemo(() => {
    if (clients.length === 0) {
      return "Nenhum cliente na base. Quando houver registros no Supabase, eles aparecerão aqui.";
    }
    if (filtered.length === 0) {
      return "Nenhum cliente corresponde à busca. Tente nome, e-mail ou telefone.";
    }
    return "Nenhum registro nesta página.";
  }, [clients.length, filtered.length]);

  return (
    <div className="w-full space-y-10 sm:space-y-11">
      <AdminStatCardsGroup>
        <AdminStatCard
          label="Total de clientes"
          value={String(metrics.totalClients)}
          hint="Cadastros com pelo menos um pedido"
          icon={Users}
        />
        <AdminStatCard
          label="Clientes recorrentes"
          value={String(metrics.recurringClients)}
          hint={`${recurringPct}% com mais de um pedido`}
          icon={UserRoundCheck}
        />
        <AdminStatCard
          label="Ticket médio"
          value={formatBRL(metrics.averageTicketCents)}
          hint="Média por pedido na base"
          icon={Ticket}
        />
        <AdminStatCard
          label="Total convertido"
          value={formatBRL(metrics.totalLifetimeCents)}
          hint="Soma do valor gasto (LTV agregado)"
          icon={Wallet}
        />
      </AdminStatCardsGroup>

      <section className="space-y-4 sm:space-y-5">
        <AdminSectionTitle
          title="Base de clientes"
          subtitle="Busque por contato e ordene por última compra ou valor total. Os cartões acima refletem toda a base carregada."
        />

        <section className="admin-filter-surface" aria-label="Filtros da lista de clientes">
          <div className="flex flex-col gap-5 lg:flex-row lg:flex-wrap lg:items-end lg:gap-x-8 lg:gap-y-5">
            <AdminSearchField
              label="Buscar"
              placeholder="Nome, e-mail ou telefone…"
              value={search}
              onChange={setSearch}
              id="clients-search"
              className="min-w-0 lg:min-w-[min(100%,18rem)] lg:flex-1"
            />
            <AdminFilterSelect<ClientSortOption>
              label="Ordenação"
              id="clients-sort-filter"
              value={sort}
              onChange={(v) => startTransition(() => setSort(v))}
              options={SORT_OPTIONS}
              className="w-full lg:w-[min(100%,280px)]"
            />
          </div>
        </section>

        <p className="text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
          {clients.length === 0 ? (
            <span>Nenhum cliente carregado.</span>
          ) : total === clients.length ? (
            <>
              Exibindo lista com <strong className="text-foreground">{total}</strong> cliente
              {total === 1 ? "" : "s"}.
            </>
          ) : (
            <>
              <strong className="text-foreground">{total}</strong> resultado{total === 1 ? "" : "s"} na lista
              filtrada <span className="text-foreground/50">(base: {clients.length})</span>
            </>
          )}
        </p>

        <div className="relative">
          <AdminTableLoadingOverlay show={listLoading} />
          <AdminDataTable
            getRowKey={(r) => r.id}
            rows={items}
            emptyMessage={emptyMessage}
            footer={
              total > 0 ? (
                <AdminPagination
                  embedded
                  page={safePage}
                  pageSize={pageSize}
                  totalItems={total}
                  onPageChange={(p) => startTransition(() => setPage(p))}
                />
              ) : undefined
            }
            columns={[
              {
                key: "name",
                header: "Nome",
                cell: (r) => <span className="font-medium text-foreground">{r.name}</span>,
              },
              {
                key: "email",
                header: "E-mail",
                cell: (r) => (
                  <span className="max-w-[200px] truncate md:max-w-[260px]" title={r.email}>
                    {r.email}
                  </span>
                ),
              },
              {
                key: "phone",
                header: "Telefone",
                cell: (r) => <span className="whitespace-nowrap">{r.phone}</span>,
              },
              {
                key: "city",
                header: "Cidade",
                cell: (r) => (
                  <span className="max-w-[160px] truncate md:max-w-[220px]" title={r.city}>
                    {r.city}
                  </span>
                ),
              },
              {
                key: "ordersCount",
                header: "Total de pedidos",
                className: "tabular-nums",
                cell: (r) => String(r.ordersCount),
              },
              {
                key: "lifetimeCents",
                header: "Total gasto",
                className: "whitespace-nowrap tabular-nums",
                cell: (r) => <span className="font-medium text-foreground">{formatBRL(r.lifetimeCents)}</span>,
              },
              {
                key: "lastOrderAt",
                header: "Última compra",
                className: "whitespace-nowrap",
                cell: (r) => (
                  <span className="text-muted-foreground">{formatDateTime(r.lastOrderAt)}</span>
                ),
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
