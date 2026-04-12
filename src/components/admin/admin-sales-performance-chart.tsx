"use client";

import { useId, useMemo, useState } from "react";
import type { SalesPerformancePoint } from "@/types/admin";
import { formatBRL } from "@/lib/admin-format";
import { cn } from "@/lib/utils";

type AdminSalesPerformanceChartProps = {
  byDay: SalesPerformancePoint[];
  byWeek: SalesPerformancePoint[];
};

const PAD = 10;
const VB = 100;

function buildPaths(points: SalesPerformancePoint[]) {
  const n = points.length;
  if (n < 2) return { lineD: "", areaD: "", coords: [] as { x: number; y: number; label: string; value: number }[] };

  const values = points.map((p) => p.valueCents);
  const min = 0;
  const max = Math.max(...values, 1);
  const range = max - min || 1;

  const coords = points.map((p, i) => {
    const x = PAD + (i / (n - 1)) * (VB - 2 * PAD);
    const y = VB - PAD - ((p.valueCents - min) / range) * (VB - 2 * PAD);
    return { x, y, label: p.label, value: p.valueCents };
  });

  const lineD = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x.toFixed(2)} ${c.y.toFixed(2)}`).join(" ");
  const areaD = `${lineD} L ${coords[coords.length - 1].x.toFixed(2)} ${VB - PAD} L ${coords[0].x.toFixed(2)} ${VB - PAD} Z`;

  return { lineD, areaD, coords };
}

export function AdminSalesPerformanceChart({ byDay, byWeek }: AdminSalesPerformanceChartProps) {
  const uid = useId().replace(/:/g, "");
  const fillGradId = `admin-chart-fill-${uid}`;
  const lineGradId = `admin-chart-line-${uid}`;
  const [period, setPeriod] = useState<"dia" | "semana">("dia");
  const data = period === "dia" ? byDay : byWeek;
  const { lineD, areaD, coords } = useMemo(() => buildPaths(data), [data]);
  const [hovered, setHovered] = useState<number | null>(null);

  const maxVal = Math.max(...data.map((d) => d.valueCents), 1);

  return (
    <div className="admin-chart-surface">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">Desempenho de vendas</h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
            Faturamento por período (dados fictícios)
          </p>
        </div>
        <div
          className="inline-flex shrink-0 rounded-xl border border-white/[0.1] bg-white/[0.035] p-1 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]"
          role="group"
          aria-label="Período do gráfico"
        >
          <button
            type="button"
            onClick={() => setPeriod("dia")}
            className={cn(
              "rounded-lg px-3.5 py-2 text-[12px] font-semibold transition-all sm:px-4 sm:text-[13px]",
              period === "dia"
                ? "bg-gold/[0.18] text-gold-bright shadow-[inset_0_0_0_1px_hsl(var(--gold)/0.28)]"
                : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
            )}
          >
            Por dia
          </button>
          <button
            type="button"
            onClick={() => setPeriod("semana")}
            className={cn(
              "rounded-lg px-3.5 py-2 text-[12px] font-semibold transition-all sm:px-4 sm:text-[13px]",
              period === "semana"
                ? "bg-gold/[0.18] text-gold-bright shadow-[inset_0_0_0_1px_hsl(var(--gold)/0.28)]"
                : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground"
            )}
          >
            Por semana
          </button>
        </div>
      </div>

      <div className="relative mt-7 md:mt-9">
        {hovered !== null && coords[hovered] ? (
          <div
            className="pointer-events-none absolute z-10 rounded-lg border border-white/[0.12] bg-[#0a101c]/95 px-3 py-2 text-xs shadow-xl backdrop-blur-md"
            style={{
              left: `clamp(0px, calc(${(coords[hovered].x / VB) * 100}% - 4rem), calc(100% - 8rem))`,
              top: "0.25rem",
            }}
          >
            <p className="font-semibold text-white">{coords[hovered].label}</p>
            <p className="mt-0.5 text-gold-bright">{formatBRL(coords[hovered].value)}</p>
          </div>
        ) : null}

        <div
          className="relative aspect-[16/7] w-full min-h-[200px] md:aspect-[21/8] md:min-h-[240px]"
          role="img"
          aria-label="Gráfico de faturamento por período (dados fictícios)"
        >
          <svg
            viewBox={`0 0 ${VB} ${VB}`}
            className="h-full w-full overflow-visible"
            preserveAspectRatio="none"
            aria-hidden
          >
            <defs>
              <linearGradient id={fillGradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(38 40% 58% / 0.35)" />
                <stop offset="100%" stopColor="hsl(38 40% 58% / 0.02)" />
              </linearGradient>
              <linearGradient id={lineGradId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(42 38% 62%)" />
                <stop offset="100%" stopColor="hsl(38 40% 52%)" />
              </linearGradient>
            </defs>

            {[0.25, 0.5, 0.75].map((t) => (
              <line
                key={t}
                x1={PAD}
                y1={VB - PAD - t * (VB - 2 * PAD)}
                x2={VB - PAD}
                y2={VB - PAD - t * (VB - 2 * PAD)}
                stroke="hsl(220 18% 18%)"
                strokeWidth={0.15}
                vectorEffect="non-scaling-stroke"
              />
            ))}

            <path d={areaD} fill={`url(#${fillGradId})`} className="transition-all duration-300" />
            <path
              d={lineD}
              fill="none"
              stroke={`url(#${lineGradId})`}
              strokeWidth={0.45}
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              className="transition-all duration-300"
            />

            {coords.map((c, i) => (
              <circle
                key={i}
                cx={c.x}
                cy={c.y}
                r={hovered === i ? 1.35 : 0.9}
                fill={hovered === i ? "hsl(var(--gold-bright))" : "hsl(var(--gold))"}
                stroke="hsl(222 48% 8%)"
                strokeWidth={0.25}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            ))}
          </svg>
        </div>

        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground md:text-xs">
          <span>Máx. período: {formatBRL(maxVal)}</span>
          <span className="hidden sm:inline">Passe o cursor nos pontos para detalhes</span>
        </div>
      </div>
    </div>
  );
}
