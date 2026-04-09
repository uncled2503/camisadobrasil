"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SectionReveal, SectionShell } from "@/components/landing/section-shell";
import { ShoppingCart, TicketPercent } from "lucide-react";

type PromoBundleProps = {
  onAddToCart: () => void;
};

export function PromoBundle({ onAddToCart }: PromoBundleProps) {
  return (
    <SectionShell variant="highlight" grain="low" className="py-12 md:py-16">
      <div className="mx-auto max-w-5xl">
        <SectionReveal className="grid items-center gap-10 md:grid-cols-2">
          <div className="relative mx-auto aspect-square w-full max-w-[320px] overflow-hidden rounded-[2rem] shadow-luxe transition-transform duration-500 hover:scale-[1.02]">
            <Image
              src="/images/promo-bundle.png"
              alt="Promoção Leve 3 Pague 2"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 320px, 480px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>

          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-gold mb-6">
              <TicketPercent size={16} />
              <span className="text-xs font-bold uppercase tracking-widest">Oferta Exclusiva</span>
            </div>
            <h2 className="font-display text-[clamp(2.5rem,5vw,3.5rem)] font-extrabold leading-tight tracking-tight text-foreground">
              Leve 3, <br/>
              <span className="bg-gradient-to-r from-gold-bright to-gold-muted bg-clip-text text-transparent">Pague apenas 2</span>
            </h2>
            <p className="mt-6 text-xl leading-relaxed text-muted-foreground">
              Garanta o kit completo para a família ou amigos com o melhor custo-benefício da coleção.
            </p>
            <div className="mt-10">
              <Button size="xl" onClick={onAddToCart} className="w-full md:w-auto">
                <ShoppingCart className="mr-2.5 h-5 w-5" />
                Aproveitar Oferta
              </Button>
            </div>
          </div>
        </SectionReveal>
      </div>
    </SectionShell>
  );
}