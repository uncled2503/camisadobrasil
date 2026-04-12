"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  LogOut,
  Users,
  ShoppingCart,
  UserCircle2,
  Settings,
  Store,
} from "lucide-react";
import { logoutAdmin } from "@/app/admin/login/actions";
import { cn } from "@/lib/utils";

export type AdminSidebarProps = {
  /** Drawer aberto (mobile). No desktop é ignorado para posição. */
  mobileOpen: boolean;
  onNavigate: () => void;
};

type NavItem = {
  href: `/admin${string}`;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
};

const nav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/vendas", label: "Vendas", icon: ShoppingCart },
  { href: "/admin/clientes", label: "Clientes", icon: UserCircle2 },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

function isNavActive(pathname: string, href: string, exact?: boolean) {
  if (exact || href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminSidebar({ mobileOpen, onNavigate }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      id="admin-sidebar"
      className={cn(
        "fixed left-0 top-0 z-40 flex h-dvh w-[17rem] flex-col border-r border-white/[0.08] bg-[#050a14]/95",
        "shadow-[6px_0_40px_-12px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-transform duration-300 ease-out",
        "md:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
      aria-label="Menu principal do painel"
    >
      <div className="flex h-[3.75rem] shrink-0 items-center border-b border-white/[0.07] px-5">
        <Link
          href="/admin"
          onClick={onNavigate}
          className="font-display text-[11px] font-bold uppercase tracking-[0.22em] text-gold-bright transition-opacity hover:opacity-90"
        >
          Alpha Admin
        </Link>
      </div>

      <div className="px-4 pb-2 pt-6">
        <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/75">
          Menu
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 pb-5" aria-label="Navegação">
        {nav.map(({ href, label, icon: Icon, exact }) => {
          const active = isNavActive(pathname, href, exact ?? false);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              className={cn(
                "group flex min-h-[2.75rem] items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium leading-snug transition-all duration-200",
                active
                  ? "bg-gold/[0.11] text-gold-bright shadow-[inset_0_0_0_1px_hsl(var(--gold)/0.22)]"
                  : "text-muted-foreground hover:bg-white/[0.045] hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors",
                  active
                    ? "bg-gold/14 text-gold-bright"
                    : "bg-white/[0.04] text-muted-foreground group-hover:bg-white/[0.08] group-hover:text-foreground"
                )}
              >
                <Icon className="h-[17px] w-[17px]" aria-hidden />
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 border-t border-white/[0.07] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="flex min-h-[2.75rem] w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium text-muted-foreground transition-colors hover:bg-white/[0.045] hover:text-foreground"
          >
            <LogOut className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
            Sair
          </button>
        </form>
        <Link
          href="/"
          onClick={onNavigate}
          className="flex min-h-[2.75rem] items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-white/[0.045] hover:text-gold-bright"
        >
          <Store className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
          Voltar à loja
        </Link>
      </div>
    </aside>
  );
}
