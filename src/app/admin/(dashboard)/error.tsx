"use client";

import { useEffect } from "react";
import { AdminPageHeader } from "@/components/admin/admin-header";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ error, reset }: Props) {
  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <AdminPageHeader
        title="Algo deu errado"
        description="Ocorreu um erro inesperado ao carregar esta área do painel."
      />
      <main className="flex-1 overflow-y-auto">
        <div className="admin-content-container px-4 py-7 pb-[max(1.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-9 sm:pb-[max(2.25rem,env(safe-area-inset-bottom))] lg:px-8 lg:py-10 lg:pb-[max(2.5rem,env(safe-area-inset-bottom))]">
          <div className="rounded-2xl border border-red-500/25 bg-red-500/[0.08] px-5 py-5 text-sm text-red-100">
            <p className="font-medium text-red-50">Detalhes</p>
            <p className="mt-2 whitespace-pre-wrap break-words text-red-100/90">{error.message}</p>
            <button
              type="button"
              onClick={reset}
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl border border-white/[0.12] bg-white/[0.06] px-4 text-[13px] font-medium text-white transition-colors hover:bg-white/[0.1]"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
