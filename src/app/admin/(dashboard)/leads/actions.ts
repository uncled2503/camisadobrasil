"use server";

import { revalidatePath } from "next/cache";

import { isAdminSessionValid } from "@/lib/admin-auth/verify-session.server";
import { updateLeadStatus } from "@/lib/supabase/lead-mutations";
import type { LeadStatus } from "@/types/admin";

export type UpdateLeadStatusActionResult = { ok: true } | { ok: false; error: string };

export async function updateLeadStatusAction(
  leadId: string,
  status: LeadStatus
): Promise<UpdateLeadStatusActionResult> {
  if (!(await isAdminSessionValid())) {
    return { ok: false, error: "Sessão expirada ou inválida. Entre novamente no painel." };
  }

  const result = await updateLeadStatus(leadId, status);
  if (result.ok) {
    revalidatePath("/admin/leads");
    revalidatePath("/admin");
  }
  return result;
}
