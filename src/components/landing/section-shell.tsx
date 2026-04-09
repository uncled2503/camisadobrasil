"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSectionRevealY } from "@/hooks/use-section-motion";

export type SectionVariant = "hero" | "default" | "soft" | "highlight";

const VARIANT_WASH: Record<SectionVariant, { className: string }> = {
  hero: {
    className:
      "bg-[linear-gradient(180deg,rgba(7,17,31,0.12)_0%,transparent_55%)]",
  },
  default: {
    className:
      "bg-[radial-gradient(ellipse_90%_70%_at_50%_25%,rgba(32,76,180,0.07),transparent_62%)]",
  },
  soft: {
    className:
      "bg-[radial-gradient(ellipse_100%_80%_at_50%_50%,rgba(255,255,255,0.025),transparent_58%)]",
  },
  highlight: {
    className:
      "bg-[radial-gradient(ellipse_75%_55%_at_50%_0%,rgba(212,175,55,0.065),transparent_58%)]",
  },
};

export type SectionShellProps = {
  variant?: SectionVariant;
  id?: string;
  "aria-labelledby"?: string;
  className?: string;
  contentClassName?: string;
  /** Mistura suave com a secção anterior */
  bleedTop?: boolean;
  /** Mistura suave com a secção seguinte */
  bleedBottom?: boolean;
  /** Grain local (o global já existe no layout) */
  grain?: "off" | "subtle" | "low";
  /** Camada extra full-bleed (ex.: parallax) entre o wash e o conteúdo */
  backgroundSlot?: ReactNode;
  children: ReactNode;
};

export function SectionShell({
  variant = "default",
  id,
  "aria-labelledby": ariaLabelledBy,
  className,
  contentClassName,
  bleedTop = true,
  bleedBottom = true,
  grain = "subtle",
  backgroundSlot,
  children,
}: SectionShellProps) {
  const wash = VARIANT_WASH[variant];

  const grainOpacity =
    grain === "off" ? 0 : grain === "low" ? 0.08 : 0.14;

  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={cn("relative overflow-hidden", className)}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-0",
          wash.className
        )}
      />

      {/* Blending superior — sem linha dura */}
      {bleedTop && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[min(8rem,18vh)] bg-gradient-to-b from-transparent via-[rgba(7,17,31,0.35)] to-transparent"
          aria-hidden
        />
      )}

      {/* Blending inferior */}
      {bleedBottom && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[min(10rem,22vh)] bg-gradient-to-t from-transparent via-[rgba(4,7,13,0.45)] to-transparent"
          aria-hidden
        />
      )}

      {/* Névoa lateral — profundidade sem cortar conteúdo */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-[min(28%,240px)] bg-gradient-to-r from-[rgba(4,7,13,0.22)] to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[min(28%,240px)] bg-gradient-to-l from-[rgba(4,7,13,0.22)] to-transparent"
        aria-hidden
      />

      {grainOpacity > 0 && (
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-grain mix-blend-overlay"
          style={{ opacity: grainOpacity }}
          aria-hidden
        />
      )}

      {backgroundSlot}

      <div
        className={cn(
          "relative z-[2] mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-32 xl:px-14",
          contentClassName
        )}
      >
        {children}
      </div>
    </section>
  );
}

/** Bloco de conteúdo com reveal — fade + translateY leve */
export function SectionReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const y = useSectionRevealY();
  const reduced = useReducedMotion();
  const offset = reduced ? 0 : y;

  return (
    <motion.div
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -8% 0px" }}
      transition={{
        duration: reduced ? 0.2 : 0.42,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Glow / fade entre duas colunas (desktop); em mobile não mostra */
export function SectionColumnBlend() {
  return (
    <>
      <div
        className="pointer-events-none absolute left-1/2 top-[10%] z-[1] hidden h-[72%] w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.06)] to-transparent lg:block"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-[12%] z-0 hidden h-[76%] w-[min(32vw,380px)] -translate-x-1/2 lg:block"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(32, 76, 180, 0.12) 0%, rgba(212, 175, 55, 0.04) 42%, transparent 68%)",
          filter: "blur(28px)",
          opacity: 0.85,
        }}
        aria-hidden
      />
    </>
  );
}

/** Wrapper relativo para grid de 2 colunas + blend central */
export function SectionSplit({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <SectionColumnBlend />
      {children}
    </div>
  );
}
