import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminPage, AdminClientsView } from "@/components/admin";
import { AdminErrorBanner } from "@/components/admin/admin-error-banner";
import { AdminClientsSkeletonBlocks } from "@/components/admin/admin-loading-shell";
import { computeClientsMetrics } from "@/lib/admin/clients-metrics";
import { fetchAdminClientes } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Clientes",
  description: "Base de clientes e métricas de relacionamento no painel administrativo.",
};

async function ClientesContent() {
  const res = await fetchAdminClientes();
  const clients = res.ok ? res.data : [];
  const metrics = computeClientsMetrics(clients);

  return (
    <>
      {!res.ok ? (
        <AdminErrorBanner messages={[res.error]} title="Não foi possível carregar os clientes" />
      ) : null}
      <AdminClientsView clients={clients} metrics={metrics} />
    </>
  );
}

export default function AdminClientesPage() {
  return (
    <AdminPage
      title="Clientes"
      description="Visão da base de compradores: recorrência, ticket médio e valor acumulado. Dados carregados do Supabase."
    >
      <Suspense fallback={<AdminClientsSkeletonBlocks />}>
        <ClientesContent />
      </Suspense>
    </AdminPage>
  );
}
