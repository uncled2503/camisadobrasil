"use client";

import { useMobileParallaxOff } from "@/hooks/use-is-mobile-parallax";

/** Deslocamento vertical suave para reveal — mais leve em mobile. */
export function useSectionRevealY() {
  const reduce = useMobileParallaxOff();
  return reduce ? 10 : 18;
}

/** Stagger curto entre itens (listas, cards). */
export const SECTION_STAGGER = 0.055;
