"use client";

import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type AdminTableLoadingOverlayProps = {
  show: boolean;
  /** Texto curto em português. */
  label?: string;
  className?: string;
};

/**
 * Overlay discreto sobre tabelas do painel durante atualização (transição / valor diferido).
 */
export function AdminTableLoadingOverlay({
  show,
  label = "Atualizando lista…",
  className,
}: AdminTableLoadingOverlayProps) {
  if (!show) return null;

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 z-[2] flex items-center justify-center rounded-2xl bg-[#060910]/45 backdrop-blur-[2px]",
        className
      )}
      aria-hidden={!show}
    >
      <div className="pointer-events-none flex items-center gap-2 rounded-xl border border-white/[0.1] bg-[#080d14]/95 px-4 py-2.5 text-[13px] text-muted-foreground shadow-lg">
        <Loader2 className="size-4 shrink-0 animate-spin text-gold/80" aria-hidden />
        <span>{label}</span>
      </div>
    </div>
  );
}
