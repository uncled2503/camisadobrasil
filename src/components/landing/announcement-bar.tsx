"use client";

import { motion } from "framer-motion";
import { Truck } from "lucide-react";

export function AnnouncementBar() {
  return (
    <div className="relative z-50 w-full overflow-hidden bg-gradient-to-r from-gold-deep via-gold to-gold-deep py-2 shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-center gap-3 px-4 text-center"
      >
        <Truck className="h-3.5 w-3.5 text-navy-deep" strokeWidth={2.5} />
        <p className="font-display text-[11px] font-bold uppercase tracking-[0.25em] text-navy-deep md:text-xs">
          Frete grátis para todo o Brasil <span className="mx-2 hidden opacity-40 sm:inline">|</span> 
          <span className="hidden sm:inline">Edição Limitada de Lançamento</span>
        </p>
      </motion.div>
      
      {/* Efeito de brilho passando */}
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 5 }}
        className="absolute inset-0 z-10 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
      />
    </div>
  );
}