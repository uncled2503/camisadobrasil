"use client";

import { Bell, Menu, Search } from "lucide-react";

type AdminTopBarProps = {
  mobileMenuOpen: boolean;
  onMenuOpen: () => void;
};

export function AdminTopBar({ mobileMenuOpen, onMenuOpen }: AdminTopBarProps) {
  return (
    <header
      className="sticky top-0 z-20 shrink-0 border-b border-white/[0.07] bg-[#060910]/75 px-4 pt-[env(safe-area-inset-top)] backdrop-blur-xl supports-[backdrop-filter]:bg-[#060910]/60 sm:px-6 lg:px-8"
      role="banner"
    >
      <div className="admin-content-container flex h-[3.75rem] items-center gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onMenuOpen}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.035] text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-colors hover:border-gold/25 hover:bg-white/[0.06] md:hidden"
          aria-label="Abrir menu de navegação"
          aria-expanded={mobileMenuOpen}
          aria-controls="admin-sidebar"
        >
          <Menu className="h-5 w-5" aria-hidden />
        </button>

        <div className="hidden min-w-0 flex-1 md:block">
          <label className="relative block max-w-lg lg:max-w-xl">
            <span className="sr-only">Buscar no painel</span>
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/75"
              aria-hidden
            />
            <input
              type="search"
              readOnly
              placeholder="Buscar pedidos, clientes… (em breve)"
              className="admin-control h-10 cursor-not-allowed pl-10 pr-3.5 opacity-80"
            />
          </label>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.09] bg-white/[0.035] text-muted-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-colors hover:border-gold/25 hover:text-gold-bright"
            aria-label="Notificações (em breve)"
          >
            <Bell className="h-[18px] w-[18px]" aria-hidden />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_hsl(var(--gold)/0.55)] ring-2 ring-[#060910]" />
          </button>
        </div>
      </div>
    </header>
  );
}
