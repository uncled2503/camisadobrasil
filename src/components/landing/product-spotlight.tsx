"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ParallaxBg } from "@/components/landing/parallax-bg";
import { SectionReveal, SectionShell, SectionSplit } from "@/components/landing/section-shell";
import { GALLERY_IMAGES } from "@/lib/product";
import { SECTION_STAGGER } from "@/hooks/use-section-motion";
import { Crown, Eye, Shirt, Wind } from "lucide-react";

const benefits = [
  {
    icon: Crown,
    title: "Design premium",
    copy: "Silhueta pensada para valorizar o corpo com presença de alto nível.",
  },
  {
    icon: Eye,
    title: "Presença marcante",
    copy: "Contraste e identidade que se leem de longe — sem excesso.",
  },
  {
    icon: Wind,
    title: "Conforto no uso",
    copy: "Respirabilidade e leveza para o dia inteiro, do estádio à cidade.",
  },
  {
    icon: Shirt,
    title: "Acabamento diferenciado",
    copy: "Costuras e detalhes que elevam a peça acima do comum.",
  },
];

export function ProductSpotlight() {
  return (
    <SectionShell
      id="sobre"
      aria-labelledby="spotlight-heading"
      variant="default"
      grain="low"
      backgroundSlot={
        <ParallaxBg className="opacity-[0.45]">
          <div className="h-full w-full bg-[radial-gradient(ellipse_70%_55%_at_15%_40%,hsl(38_30%_12%/0.28),transparent)]" />
        </ParallaxBg>
      }
    >
      <SectionSplit>
        <div className="relative z-[3] grid gap-14 lg:grid-cols-12 lg:items-start lg:gap-10 xl:gap-16">
          <div className="relative lg:col-span-5 xl:col-span-5">
            {/* Transição vertical mobile entre blocos */}
            <div
              className="pointer-events-none mb-10 h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent lg:mb-0 lg:hidden"
              aria-hidden
            />

            <SectionReveal>
              <p className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-gold/80">
                Olhar de stylist
              </p>
              <h2
                id="spotlight-heading"
                className="mt-5 font-display text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.08] tracking-tight text-balance text-foreground"
              >
                Feita para{" "}
                <span className="bg-gradient-to-r from-gold-bright to-gold-muted bg-clip-text text-transparent">
                  quem joga grande
                </span>{" "}
                fora de campo.
              </h2>
              <p className="mt-8 max-w-md text-base leading-[1.75] text-muted-foreground md:text-lg">
                Cada linha da estampa e cada curva do corte conversam com energia e precisão — uma peça
                que parece escolhida em uma campanha, não em um catálogo.
              </p>
            </SectionReveal>

            <ul className="mt-14 space-y-0">
              {benefits.map(({ icon: Icon, title, copy }, i) => (
                <motion.li
                  key={title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-5%" }}
                  transition={{
                    delay: i * SECTION_STAGGER,
                    duration: 0.38,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="group border-t border-white/[0.05] py-7 transition-colors first:border-t-0 first:pt-0 hover:border-white/[0.08]"
                >
                  <div className="flex gap-5">
                    <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/5 text-gold shadow-[0_0_0_1px_rgba(196,169,122,0.08)] transition-all duration-300 group-hover:border-gold/45 group-hover:bg-gold/10 group-hover:shadow-[0_0_24px_-8px_rgba(196,169,122,0.35)]">
                      <Icon className="h-4 w-4" strokeWidth={1.4} aria-hidden />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-semibold tracking-tight text-foreground">
                        {title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                    </div>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <SectionReveal className="relative z-[3] lg:col-span-7 lg:col-start-6 xl:col-span-7" delay={0.06}>
            <div className="pointer-events-none absolute -right-[12%] top-[8%] h-[68%] w-[65%] rounded-full bg-[radial-gradient(circle,hsl(38_35%_40%/0.1),transparent_72%)] blur-3xl" />
            <div className="relative aspect-[3/4] overflow-hidden rounded-[1.75rem] shadow-luxe transition-shadow duration-500 hover:shadow-luxe-hover md:aspect-[4/5] md:rounded-[2rem]">
              <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#04070d]/55 via-transparent to-white/[0.02]" />
              <Image
                src={GALLERY_IMAGES[1].src}
                alt={GALLERY_IMAGES[1].alt}
                fill
                className="object-cover object-center transition-transform duration-1000 ease-out hover:scale-[1.01]"
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>
            <p className="mt-6 max-w-sm text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Peça em cena · luz direcional · textura real
            </p>
          </SectionReveal>
        </div>
      </SectionSplit>
    </SectionShell>
  );
}
