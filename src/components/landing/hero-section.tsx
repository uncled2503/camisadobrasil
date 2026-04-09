"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { LuxuryProductSlider } from "@/components/ui/luxury-product-slider";
import { PRODUCT, SIZES, HERO_PRODUCT_SLIDES } from "@/lib/product";
import type { Size } from "@/lib/types";
import { useMobileParallaxOff } from "@/hooks/use-is-mobile-parallax";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";

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
  const contentY = useTransform(
    scrollYProgress,
    [0, 1],
    mobileOff || reduced ? [0, 0] : [0, 18]
  );

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative min-h-[100dvh] overflow-hidden bg-gradient-to-b from-[hsl(220,40%,8%)] to-[#04070d]"
      aria-labelledby="hero-heading"
    >
      <div className="relative z-10 mx-auto grid min-h-[100dvh] max-w-[1600px] grid-cols-1 items-center gap-14 px-5 pb-24 pt-[7.25rem] md:gap-20 md:px-10 md:pb-28 md:pt-32 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10 lg:pb-32 xl:px-14">
        <motion.div
          style={{ y: contentY }}
          className="order-2 flex flex-col justify-center text-center lg:order-1 lg:text-left"
        >
          <div className="mx-auto w-full lg:mx-0">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-8 font-sans text-xs font-bold uppercase tracking-[0.4em] text-gold md:mb-10"
            >
              Cápsula · {PRODUCT.shortName}
            </motion.p>

            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.03 }}
              className="font-display text-balance font-extrabold tracking-[-0.04em] antialiased"
            >
              <span className="block text-[clamp(2.75rem,8vw,5rem)] leading-[0.94] text-white">
                Não é só vestir.
              </span>
              <span className="mt-4 block bg-gradient-to-br from-[#f8f0dc] via-[#d9bc82] to-[#8f7348] bg-clip-text text-[clamp(2.5rem,7vw,4.5rem)] leading-[0.96] text-transparent">
                É impor presença.
              </span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="mx-auto mt-12 max-w-lg text-xl font-medium leading-relaxed text-muted-foreground md:mx-0 md:mt-14"
          >
            Coleção cápsula para quem comanda o ambiente — identidade brasileira, silhueta afiada,
            acabamento de selecionar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="mx-auto mt-14 w-full max-w-lg lg:mx-0 md:mt-18"
          >
            <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.02] p-8 shadow-luxe backdrop-blur-xl md:p-10">
              <div className="flex flex-col gap-8">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                  <div className="text-center sm:text-left">
                    <p className="font-sans text-xs font-bold uppercase tracking-widest text-muted-foreground">Preço</p>
                    <p className="mt-3 font-display text-4xl font-bold text-gold-bright">
                      {PRODUCT.priceFormatted}
                    </p>
                  </div>
                  <div className="flex-1">
                    <p className="mb-4 text-center font-sans text-xs font-bold uppercase tracking-widest text-muted-foreground sm:text-left">Tamanho</p>
                    <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
                      {SIZES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => onSizeChange(s)}
                          className={cn(
                            "relative min-h-[3rem] min-w-[3rem] overflow-hidden rounded-xl text-sm font-bold transition-all duration-300",
                            selectedSize === s
                              ? "text-navy-deep shadow-gold-soft"
                              : "border border-white/[0.1] bg-white/[0.03] text-muted-foreground hover:border-gold/50"
                          )}
                        >
                          {selectedSize === s && <span className="absolute inset-0 bg-gold-shine" />}
                          <span className="relative z-10">{s}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button size="xl" className="w-full text-base" onClick={onAddToCart}>
                  <ShoppingCart className="mr-3 h-5 w-5" />
                  Adicionar ao carrinho
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          style={{ y: imgY }}
          className="order-1 flex items-center justify-center lg:order-2"
        >
          <div className="relative w-full max-w-[340px] lg:max-w-[420px] xl:max-w-[460px]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
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