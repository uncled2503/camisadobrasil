"use server";

import { createHash, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_COOKIE_PATH,
  ADMIN_SESSION_MAX_AGE_SEC,
} from "@/lib/admin-auth/constants";
import { readAdminPassword, readAdminSessionSecret } from "@/lib/admin-auth/env";
import { sanitizeAdminRedirect } from "@/lib/admin-auth/redirect";
import { createAdminSessionToken } from "@/lib/admin-auth/session-token";

export type LoginActionState = { error: string | null };

function hashUtf8(plain: string): Buffer {
  return createHash("sha256").update(plain, "utf8").digest();
}

function verifyPassword(plain: string, expectedFromEnv: string): boolean {
  try {
    const a = hashUtf8(plain);
    const b = hashUtf8(expectedFromEnv);
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function loginAdmin(_prev: LoginActionState, formData: FormData): Promise<LoginActionState> {
  const password = String(formData.get("password") ?? "");
  const redirectTo = sanitizeAdminRedirect(String(formData.get("redirectTo") ?? ""));

  const expected = readAdminPassword();
  const secret = readAdminSessionSecret();

  if (!expected || !secret) {
    return {
      error: "Painel não configurado. Defina ADMIN_PASSWORD e ADMIN_SESSION_SECRET (mín. 16 caracteres) no servidor.",
    };
  }

  if (!verifyPassword(password, expected)) {
    return { error: "Senha incorreta." };
  }

  const token = await createAdminSessionToken(secret);
  const jar = await cookies();
  jar.set(ADMIN_SESSION_COOKIE, token, {
    path: ADMIN_SESSION_COOKIE_PATH,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: ADMIN_SESSION_MAX_AGE_SEC,
  });

  redirect(redirectTo);
}

export async function logoutAdmin(): Promise<void> {
  const jar = await cookies();
  jar.delete({
    name: ADMIN_SESSION_COOKIE,
    path: ADMIN_SESSION_COOKIE_PATH,
  });
  redirect("/admin/login");
}
