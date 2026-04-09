"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PRODUCT } from "@/lib/product";
import { ShoppingCart } from "lucide-react";

type StickyBuyBarProps = {
  onAddToCart: () => void;
};

export function StickyBuyBar({ onAddToCart }: StickyBuyBarProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const threshold = typeof window !== "undefined" ? window.innerHeight * 0.5 : 400;
      setVisible(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 110, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 110, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 38 }}
          className="fixed inset-x-0 bottom-0 z-40 md:hidden"
        >
          <div className="border-t border-white/[0.1] bg-[hsl(222,48%,3%)]/92 px-4 py-3.5 pb-[max(0.85rem,env(safe-area-inset-bottom))] shadow-[0_-24px_64px_-24px_rgba(0,0,0,0.72),0_0_52px_-20px_rgba(32,76,180,0.2),0_0_72px_-28px_rgba(212,175,55,0.09)] backdrop-blur-2xl">
            <div className="mx-auto flex max-w-lg items-center justify-between gap-5">
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.28em] text-muted-foreground">
                  Brasil Estilizada
                </p>
                <p className="mt-0.5 font-display text-[1.35rem] font-bold tabular-nums tracking-tight text-gold-bright">
                  {PRODUCT.priceFormatted}
                </p>
              </div>
              <Button size="lg" className="shrink-0 px-5 text-[11px]" onClick={onAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Adicionar
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}