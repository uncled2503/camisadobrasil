"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Gem } from "lucide-react";
import { PostPurchaseUpsellShell } from "@/components/pos-compra/post-purchase-upsell-shell";
import { posCompraObrigadoQuery, posCompraPixAddonsQuery } from "@/lib/pos-compra-routes";

function UpsellCardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vipAccepted = searchParams.get("vip") === "1";

  const goProximoPasso = (cardAccepted: boolean) => {
    if (vipAccepted || cardAccepted) {
      router.push(posCompraPixAddonsQuery(vipAccepted, cardAccepted));
      return;
    }
    router.push(posCompraObrigadoQuery(false, false));
  };

  return (
    <PostPurchaseUpsellShell
      stepLabel="Etapa 2 de 2 · Oferta especial"
      headline="Adicione o card colecionável da edição"
      subheadline="Receba um card premium exclusivo para acompanhar sua peça."
      priceDisplay="+ R$ 12,90"
      acceptLabel="Sim, quero o card colecionável"
      declineLabel="Não, finalizar sem o card"
      onAccept={() => goProximoPasso(true)}
      onDecline={() => goProximoPasso(false)}
      visual={
        <div className="relative aspect-[16/11] w-full overflow-hidden">
          <Image
            src="/images/camisa-brasil-clean.png"
            alt=""
            fill
            className="z-0 object-cover object-center opacity-30"
            sizes="(max-width: 768px) 100vw, 480px"
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-[#04070d] via-[#04070d]/75 to-gold/15" />
          <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-5 p-8">
            <div className="flex h-[5.5rem] w-[4rem] rotate-[-4deg] items-center justify-center rounded-lg border border-gold/40 bg-gradient-to-b from-[#1a1520] to-[#0a0e14] shadow-[0_12px_40px_-8px_rgba(0,0,0,0.85)]">
              <Gem className="h-8 w-8 text-gold-bright" strokeWidth={1.2} aria-hidden />
            </div>
            <p className="max-w-[15rem] text-center text-[11px] font-semibold uppercase leading-relaxed tracking-[0.18em] text-white/88">
              Edição limitada · Acabamento premium
            </p>
          </div>
        </div>
      }
    />
  );
}

export default function UpsellCardPage() {
  return (
    <Suspense fallback={<UpsellCardFallback />}>
      <UpsellCardContent />
    </Suspense>
  );
}

function UpsellCardFallback() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 bg-[#04070d] px-6">
      <div className="h-px w-20 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <p className="font-display text-[10px] font-bold uppercase tracking-[0.32em] text-gold-bright">
        A carregar oferta
      </p>
    </div>
  );
}
