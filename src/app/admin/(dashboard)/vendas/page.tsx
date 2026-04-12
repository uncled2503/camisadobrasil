import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminPage, AdminSalesView } from "@/components/admin";
import { AdminErrorBanner } from "@/components/admin/admin-error-banner";
import { AdminListPageSkeletonBlocks } from "@/components/admin/admin-loading-shell";
import { fetchAdminVendas } from "@/lib/supabase/queries";

export const metadata: Metadata = {
  title: "Vendas",
  description: "Pedidos e status de pagamento no painel administrativo.",
};

async function VendasContent() {
  const res = await fetchAdminVendas();
  return (
    <>
      {!res.ok ? <AdminErrorBanner messages={[res.error]} title="Não foi possível carregar as vendas" /> : null}
      <AdminSalesView sales={res.ok ? res.data : []} />
    </>
  );
}

export default function AdminVendasPage() {
  return (
    <AdminPage
      title="Vendas"
      description="Acompanhe pedidos, valores e situação do pagamento. Dados carregados do Supabase."
    >
      <Suspense fallback={<AdminListPageSkeletonBlocks />}>
        <VendasContent />
      </Suspense>
    </AdminPage>
  );
}
