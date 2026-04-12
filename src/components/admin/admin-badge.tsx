import { cn } from "@/lib/utils";

const leadStyles: Record<string, string> = {
  novo: "border-emerald-500/35 bg-emerald-500/10 text-emerald-200",
  em_contato: "border-sky-500/35 bg-sky-500/10 text-sky-200",
  convertido: "border-gold/40 bg-gold/10 text-gold-bright",
  perdido: "border-white/15 bg-white/[0.06] text-muted-foreground",
};

const orderStyles: Record<string, string> = {
  pago: "border-emerald-500/35 bg-emerald-500/10 text-emerald-200",
  pendente: "border-amber-500/35 bg-amber-500/10 text-amber-200",
  cancelado: "border-red-500/30 bg-red-500/10 text-red-200",
};

const leadLabels: Record<string, string> = {
  novo: "Novo",
  em_contato: "Em contato",
  convertido: "Convertido",
  perdido: "Perdido",
};

const orderLabels: Record<string, string> = {
  pago: "Pago",
  pendente: "Pendente",
  cancelado: "Cancelado",
};

type AdminBadgeProps = {
  variant: "lead" | "order";
  value: string;
};

export function AdminBadge({ variant, value }: AdminBadgeProps) {
  const map = variant === "lead" ? leadStyles : orderStyles;
  const labels = variant === "lead" ? leadLabels : orderLabels;
  const label = labels[value] ?? value;
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2.5 py-1 text-[11px] font-semibold leading-none tracking-wide",
        map[value] ?? "border-white/15 bg-white/[0.06] text-muted-foreground"
      )}
    >
      {label}
    </span>
  );
}
