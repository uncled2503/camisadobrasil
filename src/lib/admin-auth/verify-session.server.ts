import "server-only";

import { cookies } from "next/headers";

import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth/constants";
import { readAdminSessionSecret } from "@/lib/admin-auth/env";
import { verifyAdminSessionToken } from "@/lib/admin-auth/session-token";

export async function isAdminSessionValid(): Promise<boolean> {
  const secret = readAdminSessionSecret();
  if (!secret) return false;
  const raw = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!raw) return false;
  return verifyAdminSessionToken(raw, secret);
}
