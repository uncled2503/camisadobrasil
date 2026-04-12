import type { Metadata } from "next";
import { AdminPage, AdminSettingsView } from "@/components/admin";
import { isSupabasePublicEnvConfigured } from "@/lib/supabase/env-check";

export const metadata: Metadata = {
  title: "Configurações",
  description: "Preferências da loja, painel e integrações administrativas.",
};

export default function AdminConfiguracoesPage() {
  const supabaseEnvConfigured = isSupabasePublicEnvConfigured();

  return (
    <AdminPage
      title="Configurações"
      description="Centralize informações da loja, preferências do painel e visão das integrações. Esta versão é apenas visual — nada é persistido até o backend estar pronto."
    >
      <AdminSettingsView supabaseEnvConfigured={supabaseEnvConfigured} />
    </AdminPage>
  );
}
