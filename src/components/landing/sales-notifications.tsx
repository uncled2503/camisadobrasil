"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const NAMES = ["João S.", "Maria V.", "Ricardo F.", "Fernanda M.", "Lucas A.", "Beatriz R.", "Rafael C.", "Juliana P.", "Gustavo T.", "Ana L."];
const CITIES = ["São Paulo, SP", "Rio de Janeiro, RJ", "Belo Horizonte, MG", "Curitiba, PR", "Porto Alegre, RS", "Salvador, BA", "Fortaleza, CE", "Brasília, DF"];

export function SalesNotifications() {
  const [notification, setNotification] = useState<{ name: string; city: string } | null>(null);

  useEffect(() => {
    const showNotification = () => {
      const name = NAMES[Math.floor(Math.random() * NAMES.length)];
      const city = CITIES[CITIES.length - 1 - Math.floor(Math.random() * CITIES.length)];
      setNotification({ 
        name, 
        city: city || CITIES[0] 
      });

      // Tempo que a notificação fica visível
      setTimeout(() => {
        setNotification(null);
      }, 4000);
    };

    // Primeira notificação mais rápida (2 segundos)
    const initialTimer = setTimeout(showNotification, 2000);

    // Intervalo (entre 6 e 12 segundos)
    const interval = setInterval(() => {
      showNotification();
    }, 6000 + Math.random() * 6000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="fixed bottom-24 left-4 z-[60] md:bottom-6 md:left-6">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#060a12]/90 p-3 shadow-2xl backdrop-blur-xl md:gap-4 md:p-4"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-500/20 text-green-500 md:h-10 md:w-10">
              <CheckCircle2 size={18} className="md:size-5" />
            </div>
            <div className="pr-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-green-500 md:text-[11px]">
                Compra Aprovada
              </p>
              <p className="mt-0.5 text-xs font-semibold text-white md:text-sm">
                {notification.name} — {notification.city}
              </p>
              <p className="text-[9px] text-muted-foreground md:text-[10px]">
                Acabou de garantir a Edição Sagrada
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}