"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionReveal, SectionShell, SectionSplit } from "@/components/landing/section-shell";
import { GALLERY_IMAGES } from "@/lib/product";
import { SECTION_STAGGER } from "@/hooks/use-section-motion";
import { ShieldCheck, Sparkles, Map, Heart } from "lucide-react";

const benefits = [
  { icon: ShieldCheck, title: "Símbolo de Respeito", copy: "O Cristo Redentor em relevo substitui padrões polêmicos por fé e identidade." },
  { icon: Sparkles, title: "Acabamento Purificado", copy: "Textura Jacquard premium que eleva o design ao patamar de peça de colecionador." },
  { icon: Map, title: "Alma Brasileira", copy: "Cada detalhe foi pensado para representar o Brasil que nos orgulha e nos une." },
  { icon: Heart, title: "Conforto Sagrado", copy: "Tecido tecnológico respirável que oferece frescor absoluto durante todo o uso." },
];

export function ProductDetails() {
  return (
    <SectionShell id="detalhes" variant="default" grain="low" className="py-24 md:py-32">
      <SectionSplit>
        <div className="grid gap-16 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <SectionReveal>
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-gold">A Arte da Redenção</p>
              <h2 className="mt-6 font-display text-[clamp(2.5rem,5vw,3.75rem)] font-extrabold leading-[1.1] tracking-tight text-white">
                Design que <span className="text-gold-bright">honra</span> a nossa história.
              </h2>
              <p className="mt-8 text-lg leading-relaxed text-muted-foreground md:text-xl">
                Diferente de lançamentos recentes que geraram desconforto, nossa edição foca na clareza. Utilizamos a silhueta do Cristo Redentor como elemento central de proteção e orgulho nacional.
              </p>
            </SectionReveal>

            <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
              {benefits.map(({ icon: Icon, title, copy }, i) => (
                <motion.li
                  key={title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * SECTION_STAGGER }}
                  className="flex gap-5"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold/10 text-gold shadow-[inset_0_0_15px_rgba(212,175,55,0.1)]">
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <SectionReveal className="lg:col-span-5 lg:col-start-8">
            <div className="group relative mx-auto aspect-[3/4] max-w-[420px] overflow-hidden rounded-[3rem] shadow-luxe transition-all duration-700 hover:shadow-gold/20">
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-navy-deep/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />
              <Image
                src={GALLERY_IMAGES[1].src}
                alt="Detalhe do Cristo Redentor em Jacquard"
                fill
                className="object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                sizes="(max-width: 1024px) 100vw, 420px"
              />
              <div className="absolute bottom-8 left-8 right-8 z-20">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold-bright">Zoom no Detalhe</p>
                <p className="mt-1 text-sm font-medium text-white/90">Textura Jacquard Sagrada</p>
              </div>
            </div>
          </SectionReveal>
        </div>
      </SectionSplit>
    </SectionShell>
  );
}