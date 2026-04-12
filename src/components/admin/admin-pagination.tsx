"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminPaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  className?: string;
  /** Dentro do rodapé da tabela — sem borda superior duplicada. */
  embedded?: boolean;
};

function rangeLabel(page: number, pageSize: number, total: number) {
  if (total === 0) return "Nenhum registro";
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return `Mostrando ${from}–${to} de ${total}`;
}

const btn =
  "inline-flex h-10 items-center gap-1.5 rounded-xl border border-white/[0.1] bg-white/[0.04] px-3.5 text-[13px] font-medium text-foreground shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] transition-colors hover:border-white/[0.14] hover:bg-white/[0.07] disabled:pointer-events-none disabled:opacity-35";

/**
 * Paginação simples — troque por versão server-driven quando integrar ao Supabase (`page`, `pageSize` na query).
 */
export function AdminPagination({
  page,
  pageSize,
  totalItems,
  onPageChange,
  className,
  embedded,
}: AdminPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize) || 1);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div
      className={cn(
        "flex flex-col gap-3.5 sm:flex-row sm:items-center sm:justify-between",
        !embedded && "border-t border-white/[0.07] pt-5",
        embedded && "sm:px-0",
        className
      )}
    >
      <p className="text-[13px] text-muted-foreground">{rangeLabel(page, pageSize, totalItems)}</p>
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        <button type="button" disabled={!canPrev} onClick={() => onPageChange(page - 1)} className={btn}>
          <ChevronLeft className="size-4 shrink-0 opacity-90" aria-hidden />
          Anterior
        </button>
        <span className="min-w-[6.5rem] text-center text-[12px] tabular-nums text-muted-foreground/95">
          Página {page} de {totalPages}
        </span>
        <button type="button" disabled={!canNext} onClick={() => onPageChange(page + 1)} className={btn}>
          Próxima
          <ChevronRight className="size-4 shrink-0 opacity-90" aria-hidden />
        </button>
      </div>
    </div>
  );
}
