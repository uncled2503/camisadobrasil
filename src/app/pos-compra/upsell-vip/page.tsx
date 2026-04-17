"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { PostPurchaseUpsellShell } from "@/components/pos-compra/post-purchase-upsell-shell";
import { POS_COMPRA } from "@/lib/pos-compra-routes";

export default function UpsellVipPage() {
  const router = useRouter();

  return (
    <PostPurchaseUpsellShell
      stepLabel="Etapa 1 de 2 · Oferta especial"
      headline="Coloque seu pedido na fila VIP"
      subheadline="Receba prioridade máxima de separação e produção."
      priceDisplay="+ R$ 1,00"
      acceptLabel="Sim, quero prioridade VIP"
      declineLabel="Não, continuar pedido normal"
      onAccept={() => {
        router.push(`${POS_COMPRA.upsellCard}?vip=1`);
      }}
      onDecline={() => {
        router.push(POS_COMPRA.upsellCard);
      }}
      visual={
        <div className="relative aspect-[16/11] w-full overflow-hidden">
          <Image
            src="/images/checkout-hero-banner.png"
            alt=""
            fill
            className="z-0 object-cover object-center opacity-[0.2]"
            sizes="(max-width: 768px) 100vw, 480px"
            loading="lazy"
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-br from-gold/20 via-[#04070d]/85 to-[#04070d]" />
          <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-4 p-8">
            <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-gold/35 bg-gold/10 shadow-[0_0_40px_-12px_hsl(var(--gold)/0.5)]">
              <Sparkles className="h-11 w-11 text-gold-bright" strokeWidth={1.25} aria-hidden />
            </div>
            <p className="max-w-[14rem] text-center text-[11px] font-semibold uppercase leading-relaxed tracking-[0.2em] text-white/90">
              Fila prioritária · Produção acelerada
            </p>
          </div>
        </div>
      }
    />
  );
}