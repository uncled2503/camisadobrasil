import type { RevenueDayPoint } from "@/types/admin";
import { formatBRL } from "@/lib/admin-format";
import { cn } from "@/lib/utils";

type AdminRevenueBarsProps = {
  data: RevenueDayPoint[];
  title: string;
  subtitle?: string;
};

export function AdminRevenueBars({ data, title, subtitle }: AdminRevenueBarsProps) {
  const max = Math.max(...data.map((d) => d.valueCents), 1);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-gradient-to-b from-white/[0.035] to-white/[0.012] p-5 shadow-[var(--shadow-luxe)] backdrop-blur-xl md:p-6">
      <div>
        <h2 className="font-display text-base font-bold text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="mt-8 flex h-36 items-end justify-between gap-1.5 border-b border-white/[0.06] pb-2 sm:gap-2 md:h-40">
        {data.map((d) => {
          const h = Math.round((d.valueCents / max) * 100);
          return (
            <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full max-w-10 flex-1 items-end justify-center sm:max-w-12">
                <div
                  className={cn(
                    "w-full min-h-[6px] rounded-t-md bg-gradient-to-t from-gold-deep via-gold to-gold-bright opacity-90 transition-opacity hover:opacity-100"
                  )}
                  style={{ height: `${Math.max(h, 6)}%` }}
                  title={formatBRL(d.valueCents)}
                />
              </div>
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {d.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
