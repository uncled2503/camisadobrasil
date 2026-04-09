"use client";

import { ShieldCheck, Truck, RefreshCcw, Lock } from "lucide-react";
import { motion } from "framer-motion";

export function TrustBadges() {
  const items = [
    { icon: ShieldCheck, text: "Garantia de Qualidade" },
    { icon: Truck, text: "Envio para todo Brasil" },
    { icon: RefreshCcw, text: "1ª Troca Grátis" },
    { icon: Lock, text: "Pagamento 100% Seguro" },
  ];

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/5 pt-8 md:grid-cols-4 md:gap-6">
      {items.map((item, i) => (
        <motion.div
          key={item.text}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          className="flex items-center gap-2 text-left"
        >
          <item.icon className="h-4 w-4 shrink-0 text-gold/80" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
            {item.text}
          </span>
        </motion.div>
      ))}
    </div>
  );
}