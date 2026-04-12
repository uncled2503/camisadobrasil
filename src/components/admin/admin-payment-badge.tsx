import type { PaymentMethod } from "@/types/admin";
import { formatPaymentMethod } from "@/lib/admin-format";
import { cn } from "@/lib/utils";

const styles: Record<PaymentMethod, string> = {
  pix: "border-emerald-500/35 bg-emerald-500/10 text-emerald-200",
  cartao: "border-sky-500/35 bg-sky-500/10 text-sky-200",
  boleto: "border-violet-500/35 bg-violet-500/10 text-violet-200",
  pendente: "border-amber-500/35 bg-amber-500/10 text-amber-200",
};

type AdminPaymentBadgeProps = {
  method: PaymentMethod;
};

export function AdminPaymentBadge({ method }: AdminPaymentBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md border px-2.5 py-1 text-[11px] font-semibold leading-none tracking-wide",
        styles[method] ?? "border-white/15 bg-white/[0.06] text-muted-foreground"
      )}
    >
      {formatPaymentMethod(method)}
    </span>
  );
}
