import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth/constants";
import { readAdminSessionSecret } from "@/lib/admin-auth/env";
import { verifyAdminSessionToken } from "@/lib/admin-auth/session-token";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login" || pathname.startsWith("/admin/login/")) {
    return NextResponse.next();
  }

  const secret = readAdminSessionSecret();
  if (!secret) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("reason", "config");
    return NextResponse.redirect(login);
  }

  const raw = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!raw || !(await verifyAdminSessionToken(raw, secret))) {
    const login = new URL("/admin/login", request.url);
    const from = `${pathname}${request.nextUrl.search}`;
    login.searchParams.set("from", from);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
