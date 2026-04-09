"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { SectionReveal, SectionShell } from "@/components/landing/section-shell";
import { SECTION_STAGGER } from "@/hooks/use-section-motion";
import { cn } from "@/lib/utils";

const reviews = [
  {
    name: "Rafael M.",
    city: "São Paulo, SP",
    text: "Acabamento impecável. Parece peça de coleção — uso e recebo elogio toda vez.",
    rating: 5,
    imageSrc: "/images/testimonials/1.png",
  },
  {
    name: "Juliana C.",
    city: "Curitiba, PR",
    text: "O caimento valoriza demais. Cor vibrante sem parecer carnival kitsch.",
    rating: 5,
    imageSrc: "/images/testimonials/2.png",
  },
  {
    name: "Diego A.",
    city: "Belo Horizonte, MG",
    text: "Leve, confortável e com presença forte. Virou minha camisa favorita.",
    rating: 5,
    imageSrc: "/images/testimonials/3.png",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${n} de 5 estrelas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3.5 w-3.5",
            i < n ? "fill-gold text-gold" : "fill-white/[0.06] text-white/[0.06]"
          )}
          strokeWidth={0}
        />
      ))}
    </div>
  );
}

export function SocialProof() {
  return (
    <SectionShell aria-labelledby="reviews-heading" variant="default" grain="low">
      <SectionReveal className="max-w-3xl">
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-gold/75">
          Confiança
        </p>
        <h2
          id="reviews-heading"
          className="mt-4 font-display text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.06] tracking-tight"
        >
          Quem vestiu,{" "}
          <span className="bg-gradient-to-r from-gold-bright to-gold-muted bg-clip-text text-transparent">
            aprovou
          </span>
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Depoimentos de quem busca estética, caimento e presença acima da média.
        </p>
      </SectionReveal>

      <div className="mt-16 grid gap-6 md:grid-cols-3 md:gap-8">
        {reviews.map((r, i) => (
          <motion.figure
            key={r.name}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: i * SECTION_STAGGER,
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="glass-dark group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.05] p-0 transition-all duration-300 hover:border-white/[0.12] hover:shadow-luxe-hover"
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src={r.imageSrc}
                alt={`Foto do depoimento de ${r.name}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="flex flex-1 flex-col p-6 md:p-7">
              <Stars n={r.rating} />
              <blockquote className="relative z-10 mt-4 text-[15px] leading-relaxed text-foreground/95">
                {r.text}
              </blockquote>
              <figcaption className="mt-auto border-t border-white/[0.05] pt-5">
                <p className="font-display text-sm font-semibold tracking-tight">{r.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {r.city}
                </p>
              </figcaption>
            </div>
          </motion.figure>
        ))}
      </div>
    </SectionShell>
  );
}