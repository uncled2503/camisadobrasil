"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { LuxuryProductSlider } from "@/components/ui/luxury-product-slider";
import { TrustBadges } from "./trust-badges";
import { PRODUCT, SIZES, HERO_PRODUCT_SLIDES } from "@/lib/product";
import type { Size } from "@/lib/types";
import { useMobileParallaxOff } from "@/hooks/use-is-mobile-parallax";
import { cn } from "@/lib/utils";
import { ShoppingCart, Star } from "lucide-react";

type HeroSectionProps = {
  selectedSize: Size;
  onSizeChange: (s: Size) => void;
  onAddToCart: () => void;
};

export function HeroSection({
  selectedSize,
  onSizeChange,
  onAddToCart,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const mobileOff = useMobileParallaxOff();
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const imgY = useTransform(
    scrollYProgress,
    [0, 1],
    mobileOff || reduced ? [0, 0] : [0, 48]
  );

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative min-h-[100dvh] overflow-hidden bg-[#04070d]"
      aria-labelledby="hero-heading"
    >
      <div className="relative z-10 mx-auto grid min-h-[100dvh] max-w-[1600px] grid-cols-1 items-center gap-14 px-5 pb-24 pt-[7.25rem] md:gap-20 md:px-10 md:pb-28 md:pt-32 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 xl:px-14">
        
        <div className="order-2 flex flex-col justify-center text-center lg:order-1 lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center justify-center gap-2 lg:justify-start"
          >
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-gold text-gold" />
              ))}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold/90">
              +4.800 CLIENTES SATISFEITOS
            </span>
          </motion.div>

          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display font-extrabold tracking-tight"
          >
            <span className="block text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.9] text-white">
              A Identidade que
            </span>
            <span className="mt-2 block bg-gradient-to-r from-gold-bright via-gold to-gold-muted bg-clip-text text-[clamp(2.5rem,7vw,4.5rem)] leading-[1] text-transparent">
              Protege e Une.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-8 max-w-xl text-lg font-medium leading-relaxed text-muted-foreground/90 lg:mx-0 md:text-xl"
          >
            Design purificado com a presença do <span className="text-white font-bold">Cristo Redentor</span> em jacquard. Uma peça que resgata a verdadeira essência do Brasil com elegância e respeito.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 flex flex-col gap-6"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.02] p-6 shadow-luxe backdrop-blur-xl md:p-10">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Preço Exclusivo</p>
                    <div className="mt-2 flex items-baseline justify-center gap-2 sm:justify-start">
                      <span className="text-sm text-muted-foreground line-through">R$ 149,00</span>
                      <span className="font-display text-4xl font-bold text-gold-bright">{PRODUCT.priceFormatted}</span>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <p className="mb-3 text-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground sm:text-left">Selecione seu Tamanho</p>
                    <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                      {SIZES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => onSizeChange(s)}
                          className={cn(
                            "group relative flex h-12 w-12 items-center justify-center rounded-xl text-xs font-bold transition-all duration-300",
                            selectedSize === s
                              ? "text-navy-deep"
                              : "border border-white/10 bg-white/[0.03] text-muted-foreground hover:border-gold/40"
                          )}
                        >
                          {selectedSize === s && (
                            <motion.span 
                              layoutId="size-bg"
                              className="absolute inset-0 rounded-xl bg-gold-shine" 
                            />
                          )}
                          <span className="relative z-10">{s}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button 
                  size="xl" 
                  className="w-full text-base font-bold uppercase tracking-widest shadow-[0_0_30px_-5px_hsl(var(--gold)/0.4)]" 
                  onClick={onAddToCart}
                >
                  <ShoppingCart className="mr-3 h-5 w-5" />
                  Garantir minha Edição Sagrada
                </Button>
              </div>
              
              <TrustBadges />
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ y: imgY }}
          className="order-1 flex items-center justify-center lg:order-2"
        >
          <div className="relative w-full max-w-[380px] lg:max-w-[500px]">
            <div className="absolute -inset-4 rounded-[3rem] bg-gold/5 blur-3xl" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="hero-product-frame overflow-hidden rounded-[2.5rem] bg-navy-deep/40 backdrop-blur-sm"
            >
              <LuxuryProductSlider
                images={HERO_PRODUCT_SLIDES}
                priority
                quality={95}
                aspectClassName="aspect-[4/5]"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}