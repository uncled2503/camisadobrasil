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
      {/* Camadas de atmosfera — profundidade cinematográfica */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(220,40%,20%),transparent_60%)] opacity-40" />
      <div className="pointer-events-none absolute -left-[20%] top-[5%] h-full w-3/4 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(80,120,255,0.1),transparent_65%)] opacity-80 blur-3xl" />
      <div className="pointer-events-none absolute -right-[20%] top-[10%] h-full w-3/4 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_65%)] opacity-80 blur-3xl" />

      <div className="relative z-10 mx-auto grid min-h-[100dvh] max-w-[1600px] grid-cols-1 items-center gap-14 px-5 pb-24 pt-[7.25rem] md:gap-20 md:px-10 md:pb-28 md:pt-32 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.08fr)] lg:gap-10 lg:pb-32 xl:px-14">
        {/* Coluna editorial */}
        <motion.div
          style={{ y: contentY }}
          className="order-2 flex flex-col justify-center text-center lg:order-1 lg:max-w-[min(100%,36rem)] lg:text-left"
        >
          <div className="mx-auto w-full max-w-[min(100%,22rem)] sm:max-w-[min(100%,30rem)] lg:mx-0">
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="mb-8 font-sans text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-[hsl(38,28%,52%)] md:mb-9 md:text-[0.7rem] md:tracking-[0.42em]"
            >
              Cápsula · {PRODUCT.shortName}
            </motion.p>

            <motion.h1
              id="hero-heading"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.03 }}
              className="font-display text-balance font-extrabold tracking-[-0.045em] antialiased"
            >
              <span className="block text-[clamp(2.25rem,6.5vw,3.85rem)] leading-[0.96] text-[hsl(210,25%,99%)] drop-shadow-[0_2px_48px_rgba(0,0,0,0.4)]">
                Não é só vestir.
              </span>
              <span className="mt-[0.28em] block bg-gradient-to-br from-[#f8f0dc] from-[5%] via-[#d9bc82] via-[48%] to-[#8f7348] bg-clip-text text-[clamp(2.1rem,6vw,3.55rem)] leading-[0.98] text-transparent drop-shadow-[0_0_48px_rgba(217,188,130,0.4)]">
                É impor presença.
              </span>
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="mx-auto mt-11 max-w-[26rem] text-[clamp(0.92rem,2.35vw,1.0625rem)] font-medium leading-[1.62] tracking-[0.01em] text-[hsl(215,14%,68%)] md:mx-0 md:mt-12"
          >
            Coleção cápsula para quem comanda o ambiente — identidade brasileira, silhueta afiada,
            acabamento de selecionar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14 }}
            className="mx-auto mt-12 w-full max-w-lg lg:mx-0 md:mt-16"
          >
            <div className="relative overflow-hidden rounded-[1.65rem] border border-white/[0.07] bg-[linear-gradient(165deg,rgba(255,255,255,0.045)_0%,rgba(255,255,255,0.01)_45%,transparent_100%)] p-6 shadow-luxe backdrop-blur-xl md:rounded-[1.85rem] md:p-8">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
                  <div className="text-center sm:text-left">
                    <p className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[hsl(215,14%,48%)]">
                      Preço
                    </p>
                    <p className="mt-2 font-display text-[clamp(2rem,4.5vw,2.75rem)] font-semibold tabular-nums tracking-[-0.02em] text-[hsl(42,38%,74%)]">
                      {PRODUCT.priceFormatted}
                    </p>
                  </div>
                  <div className="flex-1 sm:min-w-0">
                    <p className="mb-3 text-center font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[hsl(215,14%,48%)] sm:text-left">
                      Tamanho
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                      {SIZES.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => onSizeChange(s)}
                          className={cn(
                            "relative min-h-[2.85rem] min-w-[2.85rem] overflow-hidden rounded-xl text-[0.8125rem] font-medium tracking-[0.06em] transition-all duration-300",
                            selectedSize === s
                              ? "text-[hsl(222,44%,6%)] shadow-gold-soft"
                              : "border border-white/[0.09] bg-white/[0.025] text-[hsl(215,14%,62%)] hover:border-gold/30 hover:text-[hsl(210,25%,92%)]"
                          )}
                        >
                          {selectedSize === s && (
                            <span className="absolute inset-0 bg-gold-shine" />
                          )}
                          <span className="relative z-10">{s}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  size="xl"
                  className="w-full"
                  onClick={onAddToCart}
                >
                  <ShoppingCart className="mr-2.5 h-4 w-4" />
                  Adicionar ao carrinho
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Produto — nitidez: foto isolada, glow atrás, textos em HTML */}
        <motion.div
          style={{ y: imgY }}
          className="order-1 flex min-h-[40vh] items-center justify-center lg:order-2 lg:min-h-[78vh]"
        >
          <div className="relative w-full max-w-[min(100%,28rem)] lg:max-w-[min(100%,36rem)] lg:justify-self-end xl:max-w-[min(100%,40rem)] xl:pr-2">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full"
            >
              <div className="relative z-10 hero-product-frame flex flex-col overflow-hidden rounded-[1.75rem] bg-navy-deep md:rounded-[2rem]">
                <div className="relative flex w-full items-center justify-center">
                  <div className="relative w-full max-w-[min(100%,520px)] lg:max-w-[min(100%,600px)]">
                    <LuxuryProductSlider
                      images={HERO_PRODUCT_SLIDES}
                      priority
                      quality={95}
                      sizes="(max-width: 640px) 94vw, (max-width: 1024px) 88vw, min(600px, 42vw)"
                      aspectClassName="aspect-[812/1024]"
                      aria-label="Vídeo da camisa em loop"
                    >
                      <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/60 via-black/40 to-transparent p-5 text-center">
                        <div
                          role="status"
                          className="inline-flex items-center justify-center rounded-full border border-gold/30 bg-black/40 px-4 py-1.5"
                        >
                          <p className="font-display text-[9px] font-bold uppercase tracking-[0.3em] text-gold-bright">
                            Edição de Elite
                          </p>
                        </div>
                      </div>
                    </LuxuryProductSlider>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Continuidade com a secção seguinte — sem corte seco */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-[8] h-[min(7rem,14vh)] bg-gradient-to-t from-[#07111f]/85 via-[#04070d]/35 to-transparent"
        aria-hidden
      />
    </section>
  );
}