"use server";

import { createSupabaseAdminClient } from "@/lib/supabase/admin-client";
import { revalidatePath } from "next/cache";
import { isAdminSessionValid } from "@/lib/admin-auth/verify-session.server";

export async function updateConfiguracoes(linkRastreio: string) {
  if (!(await isAdminSessionValid())) {
    return { error: "Sessão expirada ou inválida." };
  }

  const admin = createSupabaseAdminClient();
  if (!admin) {
    return { error: "Supabase não configurado no servidor." };
  }

  const { error } = await admin
    .from("configuracoes")
    .upsert({ id: 1, link_rastreio: linkRastreio, updated_at: new Date().toISOString() });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/configuracoes");
  return { success: true };
}