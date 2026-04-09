"use client";

import { motion } from "framer-motion";
import { SectionReveal, SectionShell } from "@/components/landing/section-shell";

const rows = [
  { size: "P", bust: "92–96", length: "68–70", shoulder: "42–44" },
  { size: "M", bust: "96–100", length: "70–72", shoulder: "44–46" },
  { size: "G", bust: "100–106", length: "72–74", shoulder: "46–48" },
  { size: "GG", bust: "106–112", length: "74–76", shoulder: "48–50" },
];

export function SizeChart() {
  return (
    <SectionShell
      aria-labelledby="sizes-heading"
      variant="soft"
      grain="off"
      contentClassName="mx-auto max-w-4xl !px-5 md:!px-10"
    >
      <SectionReveal className="text-center">
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-gold/75">
          Fit
        </p>
        <h2
          id="sizes-heading"
          className="mt-4 font-display text-[clamp(2.25rem,4vw,3rem)] font-bold leading-tight tracking-tight"
        >
          Tabela de{" "}
          <span className="bg-gradient-to-r from-gold-bright to-gold-muted bg-clip-text text-transparent">
            medidas
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-lg leading-relaxed text-muted-foreground">
          Medidas aproximadas em centímetros. Em dúvida entre dois tamanhos, prefira o maior para
          caimento mais solto.
        </p>
      </SectionReveal>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mt-14 overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-luxe backdrop-blur-sm transition-shadow duration-300 hover:border-white/[0.09] hover:shadow-luxe-hover"
      >
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-white/[0.06] bg-white/[0.03]">
              <th className="px-6 py-5 font-display text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Tamanho
              </th>
              <th className="px-6 py-5 font-display text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Busto
              </th>
              <th className="px-6 py-5 font-display text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Comprimento
              </th>
              <th className="px-6 py-5 font-display text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Ombro
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.size}
                className="border-b border-white/[0.04] transition-colors last:border-0 hover:bg-white/[0.025]"
              >
                <td className="px-6 py-5">
                  <span className="inline-flex min-w-[2.75rem] items-center justify-center rounded-lg border border-gold/30 bg-gradient-to-b from-gold/12 to-gold/5 px-2.5 py-1.5 font-display text-sm font-bold tabular-nums text-gold-bright transition-transform duration-300 hover:scale-[1.02]">
                    {row.size}
                  </span>
                </td>
                <td className="px-6 py-5 tabular-nums text-muted-foreground">{row.bust} cm</td>
                <td className="px-6 py-5 tabular-nums text-muted-foreground">{row.length} cm</td>
                <td className="px-6 py-5 tabular-nums text-muted-foreground">{row.shoulder} cm</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </SectionShell>
  );
}