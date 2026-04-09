"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { LuxuryProductSlider } from "@/components/ui/luxury-product-slider";
import { PRODUCT, SIZES, HERO_PRODUCT_SLIDES, type Size } from "@/lib/product";
import { ParallaxBg } from "@/components/landing/parallax-bg";
import { useMobileParallaxOff } from "@/hooks/use-is-mobile-parallax";
import { cn } from "@/lib/utils";

/** Prova social de lançamento — próxima ao CTA */
const launchProof = [
  "Edição limitada",
  "Lançamento exclusivo",
  "Envio rápido",
  "Pix",
] as const;

type HeroSectionProps = {
  selectedSize: Size;
  onSizeChange: (s: Size) => void;
  onBuy: () => void;
};

export function HeroSection({
  selectedSize,
  onSizeChange,
  onBuy,
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
      className="relative min-h-[100dvh] overflow-hidden bg-[#04070d]"
      aria-labelledby="hero-heading"
    >
      {/* Camadas de atmosfera — profundidade cinematográfica */}
      <div className="pointer-events-none absolute inset-0 bg-hero-ambient" />
      <div className="pointer-events-none absolute -left-[20%] top-0 h-[55%] w-[70%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(196,169,122,0.07),transparent_62%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-hero-vignette opacity-[0.92]" />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.32]" />

      <ParallaxBg className="opacity-[0.82]">
        <div className="h-full w-full bg-gold-radial" />
        <div
          className="absolute inset-0 opacity-[0.028]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23c4a574' stroke-opacity='0.35'%3E%3Cpath d='M0 40h80M40 0v80'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </ParallaxBg>

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

              {/* Microcopy de lançamento */}
              <div className="mb-7 flex flex-wrap justify-center gap-2 sm:justify-start">
                {launchProof.map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-sans text-[9px] font-medium uppercase tracking-[0.22em] text-[hsl(215,14%,58%)]"
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-9 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
                <div className="text-center sm:text-left">
                  <p className="font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[hsl(215,14%,48%)]">
                    Investimento
                  </p>
                  <p className="mt-2 font-display text-[clamp(2rem,4.5vw,2.75rem)] font-semibold tabular-nums tracking-[-0.02em] text-[hsl(42,38%,74%)]">
                    {PRODUCT.priceFormatted}
                  </p>
                </div>
                <div className="flex-1 sm:min-w-0">
                  <p className="mb-3 text-left font-sans text-[10px] font-medium uppercase tracking-[0.3em] text-[hsl(215,14%,48%)]">
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

              <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-white/[0.1] to-transparent" />

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-3">
                  <Button
                    size="xl"
                    className="w-full min-w-0 sm:min-w-[15rem] sm:flex-1"
                    onClick={onBuy}
                  >
                    Garantir minha peça
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full normal-case text-[0.8125rem] font-medium tracking-[0.1em] sm:w-auto sm:min-w-[11rem]"
                    asChild
                  >
                    <a href="#galeria">Ver detalhes</a>
                  </Button>
                </div>
                <p className="text-center font-sans text-[11px] leading-relaxed tracking-[0.04em] text-[hsl(215,12%,48%)] sm:text-left">
                  Lançamento exclusivo · peças restritas à leva atual · envio ágil após confirmação
                </p>
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
            {/* Luz ambiente só atrás do card — não cobre a foto */}
            <div
              className="pointer-events-none absolute -left-[18%] top-[8%] h-[72%] w-[95%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(196,169,122,0.1),transparent_65%)] blur-[48px]"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-[10%] bottom-[12%] h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(196,169,122,0.07),transparent_72%)] blur-[40px]"
              aria-hidden
            />

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full"
            >
              <div className="relative">
                {/* Halo dourado difuso atrás do card */}
                <div
                  className="pointer-events-none absolute -inset-3 z-0 rounded-[2rem] opacity-95 blur-[44px] md:-inset-4 md:rounded-[2.25rem]"
                  style={{
                    background:
                      "radial-gradient(ellipse 68% 58% at 50% 42%, rgba(212, 175, 55, 0.3), rgba(196, 169, 122, 0.1) 48%, transparent 72%)",
                  }}
                  aria-hidden
                />
                <div className="relative z-10 hero-product-frame flex flex-col overflow-hidden rounded-[1.75rem] bg-[hsl(222,38%,7%)] md:rounded-[2rem]">
                {/* Área da foto: sem overlays, sem blur, sem escala no hover */}
                <div className="relative flex w-full items-center justify-center px-3 pt-2.5 sm:px-5 sm:pt-4">
                  <div className="relative w-full max-w-[min(100%,520px)] lg:max-w-[min(100%,600px)]">
                    <LuxuryProductSlider
                      images={HERO_PRODUCT_SLIDES}
                      priority
                      quality={95}
                      sizes="(max-width: 640px) 94vw, (max-width: 1024px) 88vw, min(600px, 42vw)"
                      aspectClassName="aspect-[812/1024]"
                      aria-label="Vídeo da camisa em loop"
                      showPagination={false}
                    >
                      <div className="relative border-t border-[rgba(212,175,55,0.14)] bg-[linear-gradient(180deg,rgba(212,175,55,0.08)_0%,rgba(0,0,0,0.2)_40%,rgba(0,0,0,0.3)_100%)] px-5 pb-6 pt-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] sm:px-8 sm:pb-7 sm:pt-5">
                        <div className="flex flex-col items-center gap-3 text-center sm:gap-3.5">
                          {/*
                            Faixa demarcada: traço + ponto + chip compacto no mesmo bloco
                            (menos altura, botão menor, subindo para a zona dos acentos).
                          */}
                          <div className="flex flex-col items-center gap-2 sm:gap-2">
                            <div
                              className="flex items-center justify-center gap-2"
                              aria-hidden
                            >
                              <span className="h-[2px] w-5 rounded-full bg-gradient-to-r from-transparent via-[hsl(38,42%,58%)] to-transparent opacity-90 sm:w-6" />
                              <span className="h-1 w-1 rounded-full bg-white/[0.18] ring-1 ring-white/25" />
                            </div>
                            <div
                              role="status"
                              className="inline-flex w-fit shrink-0 items-center justify-center rounded-full border border-[rgba(212,175,55,0.38)] bg-gradient-to-b from-[rgba(212,175,55,0.11)] via-[rgba(196,169,122,0.04)] to-transparent px-3 py-1 shadow-[0_0_22px_-8px_rgba(212,175,55,0.32),inset_0_1px_0_0_rgba(255,255,255,0.1)] sm:px-3.5 sm:py-1"
                            >
                              <p className="font-display text-[8px] font-bold uppercase tracking-[0.26em] text-[hsl(42,42%,90%)] sm:text-[9px] sm:tracking-[0.3em]">
                                Edição de elite
                              </p>
                            </div>
                          </div>
                          <p className="max-w-[22rem] font-sans text-[9px] font-medium uppercase leading-relaxed tracking-[0.18em] text-white/45 sm:max-w-lg sm:text-[10px] sm:tracking-[0.2em]">
                            Seleção brasileira &apos;10&apos; · Coleção limitada
                          </p>
                          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-0.5 sm:pt-1">
                            <span className="inline-flex items-center rounded-full border border-white/[0.12] bg-gradient-to-b from-white/[0.09] to-white/[0.02] px-3.5 py-1.5 font-sans text-[9px] font-semibold uppercase tracking-[0.22em] text-white/[0.82] shadow-[0_1px_0_rgba(255,255,255,0.06)_inset] backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:from-white/[0.12] hover:text-white">
                              Cápsula
                            </span>
                            <span className="inline-flex items-center rounded-full border border-[hsl(152,28%,28%)]/50 bg-[linear-gradient(180deg,hsl(152,20%,16%)_0%,hsl(152,22%,10%)_100%)] px-3.5 py-1.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-[hsl(152,32%,76%)] shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] transition-all duration-300 hover:border-[hsl(152,35%,38%)]/60 hover:text-[hsl(152,36%,86%)]">
                              Brasil
                            </span>
                          </div>
                        </div>
                      </div>
                    </LuxuryProductSlider>
                  </div>
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
