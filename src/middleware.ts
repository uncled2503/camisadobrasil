import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * O middleware agora apenas garante que as rotas básicas funcionam.
 * A proteção real das rotas /admin é feita no layout do dashboard
 * ou via Supabase session no cliente para uma melhor experiência (UX).
 */
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};