import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth/constants";
import { readAdminPassword, readAdminSessionSecret } from "@/lib/admin-auth/env";
import { sanitizeAdminRedirect } from "@/lib/admin-auth/redirect";
import { verifyAdminSessionToken } from "@/lib/admin-auth/session-token";

import { AdminLoginForm } from "./admin-login-form";

type PageProps = {
  searchParams: Promise<{ from?: string; reason?: string }>;
};

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const secret = readAdminSessionSecret();
  if (secret) {
    const raw = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
    if (raw && (await verifyAdminSessionToken(raw, secret))) {
      redirect(sanitizeAdminRedirect(sp.from));
    }
  }

  const redirectTo = sanitizeAdminRedirect(sp.from);
  const envIncomplete = !readAdminSessionSecret() || !readAdminPassword();
  const showConfigHint = sp.reason === "config" || envIncomplete;

  return (
    <div className="admin-shell-bg flex min-h-[100dvh] items-center justify-center px-4 py-10">
      <div className="admin-settings-surface w-full max-w-md">
        <AdminLoginForm redirectTo={redirectTo} showConfigHint={showConfigHint} />
      </div>
    </div>
  );
}
