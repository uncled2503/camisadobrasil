import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AdminStatCardProps = {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  className?: string;
};

export function AdminStatCard({ label, value, hint, icon: Icon, className }: AdminStatCardProps) {
  return (
    <div className={cn("admin-stat-surface group", className)}>
      <div className="flex items-start justify-between gap-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground/90">{label}</p>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/[0.12] text-gold ring-1 ring-gold/15 transition-[background-color,box-shadow] group-hover:bg-gold/[0.16]">
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </span>
      </div>
      <p className="mt-4 font-display text-2xl font-bold tracking-tight text-white sm:text-[1.75rem] lg:text-3xl">
        {value}
      </p>
      {hint ? <p className="mt-2.5 text-xs leading-relaxed text-muted-foreground/90">{hint}</p> : null}
    </div>
  );
}
