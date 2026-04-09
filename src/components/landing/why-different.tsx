"use client";

import { motion } from "framer-motion";
import { ParallaxBg } from "@/components/landing/parallax-bg";
import { SectionReveal, SectionShell } from "@/components/landing/section-shell";
import { SECTION_STAGGER } from "@/hooks/use-section-motion";

const points = [
  {
    title: "Personalidade em primeiro lugar",
    body: "Não é só uma camisa verde e amarela — é uma declaração de atitude com refinamento urbano.",
  },
  {
    title: "Valor percebido real",
    body: "Materiais e construção que traduzem cuidado: você veste confiança, não só tecido.",
  },
  {
    title: "Destaque sem gritar",
    body: "A estética equilibra força e elegância: presença forte, sem perder classe.",
  },
];

export function WhyDifferent() {
  return (
    <SectionShell
      id="como-funciona"
      aria-labelledby="why-heading"
      variant="soft"
      grain="low"
      backgroundSlot={
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <ParallaxBg className="opacity-[0.35]">
            <div className="h-full w-full bg-mesh-gradient opacity-95" />
          </ParallaxBg>
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,hsl(222_48%_3%/0)_0%,hsl(222_40%_6%/0.22)_48%,hsl(222_48%_3%/0)_100%)]" />
        </div>
      }
    >
      <div className="relative z-[3]">
        <SectionReveal className="max-w-4xl">
          <p className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-gold/75">
            Narrativa
          </p>
          <h2
            id="why-heading"
            className="mt-5 font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold leading-[1.06] tracking-tight text-balance"
          >
            Por que essa camisa é{" "}
            <span className="bg-gradient-to-r from-gold-bright via-gold to-gold-muted bg-clip-text text-transparent">
              diferente
            </span>
          </h2>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            Mais que especificações: é sobre como você se sente quando entra no ambiente.
          </p>
        </SectionReveal>

        <div className="mt-16 grid gap-4 md:grid-cols-12 md:gap-5">
          <motion.article
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="glass-dark relative overflow-hidden rounded-[1.35rem] border border-white/[0.06] p-8 transition-all duration-300 hover:border-white/[0.12] hover:shadow-luxe-hover md:col-span-7 md:min-h-[320px] md:p-12"
          >
            <span className="font-display text-7xl font-bold leading-none text-white/[0.04] md:text-8xl">
              01
            </span>
            <p className="mt-6 font-display text-xl font-semibold leading-snug tracking-tight text-foreground md:text-2xl">
              {points[0].title}
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              {points[0].body}
            </p>
          </motion.article>

          <div className="flex flex-col gap-4 md:col-span-5">
            {[points[1], points[2]].map((p, i) => (
              <motion.article
                key={p.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: SECTION_STAGGER * (i + 1),
                  duration: 0.38,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="glass-dark flex flex-1 flex-col justify-center rounded-[1.35rem] border border-white/[0.06] p-8 transition-all duration-300 hover:border-white/[0.11] hover:shadow-luxe-hover md:p-10"
              >
                <p className="font-display text-lg font-semibold tracking-tight text-foreground">
                  {p.title}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}
