"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SectionReveal, SectionShell, SectionSplit } from "@/components/landing/section-shell";
import { GALLERY_IMAGES } from "@/lib/product";
import { SECTION_STAGGER } from "@/hooks/use-section-motion";
import { Crown, Eye, Shirt, Wind } from "lucide-react";

const benefits = [
  { icon: Crown, title: "Design premium", copy: "Silhueta pensada para valorizar o corpo com presença de alto nível." },
  { icon: Eye, title: "Presença marcante", copy: "Contraste e identidade que se leem de longe — sem excesso." },
  { icon: Wind, title: "Conforto no uso", copy: "Respirabilidade e leveza para o dia inteiro, do estádio à cidade." },
  { icon: Shirt, title: "Acabamento diferenciado", copy: "Costuras e detalhes que elevam a peça acima do comum." },
];

export function ProductDetails() {
  return (
    <SectionShell id="detalhes" variant="default" grain="low" className="py-24 md:py-32">
      <SectionSplit>
        <div className="grid gap-20 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6">
            <SectionReveal>
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-gold">Olhar de stylist</p>
              <h2 className="mt-6 font-display text-[clamp(3rem,6vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight text-white">
                Feita para <span className="text-gold-bright">quem joga grande</span> fora de campo.
              </h2>
              <p className="mt-10 text-xl leading-relaxed text-muted-foreground">
                Cada linha da estampa e cada curva do corte conversam com energia e precisão — uma peça
                que parece escolhida em uma campanha, não em um catálogo.
              </p>
            </SectionReveal>

            <ul className="mt-16 space-y-8">
              {benefits.map(({ icon: Icon, title, copy }, i) => (
                <motion.li
                  key={title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * SECTION_STAGGER }}
                  className="flex gap-6"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                    <Icon size={20} />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
                    <p className="mt-2 text-base text-muted-foreground">{copy}</p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>

          <SectionReveal className="lg:col-span-5 lg:col-start-8">
            <div className="relative mx-auto aspect-[3/4] max-w-[400px] overflow-hidden rounded-[2.5rem] shadow-luxe">
              <Image
                src={GALLERY_IMAGES[1].src}
                alt={GALLERY_IMAGES[1].alt}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 400px"
              />
            </div>
          </SectionReveal>
        </div>
      </SectionSplit>
    </SectionShell>
  );
}