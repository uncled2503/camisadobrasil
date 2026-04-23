import type { Metadata } from "next";
import { AdminPage, AdminSettingsView } from "@/components/admin";
import { isSupabasePublicEnvConfigured } from "@/lib/supabase/env-check";
import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";

export const metadata: Metadata = {
  title: "Configurações",
  description: "Preferências da loja, painel e integrações administrativas.",
};

export default async function AdminConfiguracoesPage() {
  const supabaseEnvConfigured = isSupabasePublicEnvConfigured();
  const admin = createSupabaseAdminClient();

  let initialSettings = {
    tracking_link: "https://rastrearlog.online",
    whatsapp: "(11) 99999-0000",
    contact_email: "contato@alphabrasil.com.br"
  };

  if (admin) {
    const { data } = await admin.from("store_settings").select("*").eq("id", 1).maybeSingle();
    if (data) {
      initialSettings = {
        tracking_link: data.tracking_link || initialSettings.tracking_link,
        whatsapp: data.whatsapp || initialSettings.whatsapp,
        contact_email: data.contact_email || initialSettings.contact_email
      };
    }
  }

  return (
    <AdminPage
      title="Configurações"
      description="Centralize as informações da loja e altere os links dinâmicos do sistema, como o site de rastreamento que aparece após a compra."
    >
      <AdminSettingsView supabaseEnvConfigured={supabaseEnvConfigured} initialSettings={initialSettings} />
    </AdminPage>
  );
}