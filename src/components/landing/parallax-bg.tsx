"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { useMobileParallaxOff } from "@/hooks/use-is-mobile-parallax";
import { cn } from "@/lib/utils";

type ParallaxBgProps = {
  className?: string;
  children?: React.ReactNode;
  /** Intensidade do movimento em px (desktop). */
  range?: number;
};

export function ParallaxBg({ className, children, range = 40 }: ParallaxBgProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mobileOff = useMobileParallaxOff();
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    mobileOff || reduced ? [0, 0] : [range * 0.35, -range * 0.35]
  );
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0.45, 0.75, 0.65, 0.35]);

  return (
    <div ref={ref} className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <motion.div style={{ y, opacity }} className="absolute inset-[-15%] will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
