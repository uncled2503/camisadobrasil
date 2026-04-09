"use client";

import { useState } from "react";
import { HeroSection } from "@/components/landing/hero-section";
import { ProductSpotlight } from "@/components/landing/product-spotlight";
import { WhyDifferent } from "@/components/landing/why-different";
import { PremiumGallery } from "@/components/landing/premium-gallery";
import { SocialProof } from "@/components/landing/social-proof";
import { SizeChart } from "@/components/landing/size-chart";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCta } from "@/components/landing/final-cta";
import { StickyBuyBar } from "@/components/landing/sticky-buy-bar";
import { SiteNavDesktop, SiteNavMobile } from "@/components/landing/site-nav";
import { PurchaseDialog } from "@/components/purchase/purchase-dialog";
import type { Size } from "@/lib/product";

export default function HomePage() {
  const [selectedSize, setSelectedSize] = useState<Size>("M");
  const [purchaseOpen, setPurchaseOpen] = useState(false);

  const openPurchase = () => setPurchaseOpen(true);

  return (
    <>
      <a
        href="#main"
        className="pointer-events-none fixed left-4 top-4 z-[100] -translate-y-20 rounded-xl border border-white/10 bg-gold-shine px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-[hsl(222,44%,6%)] opacity-0 shadow-gold-soft transition focus:pointer-events-auto focus:translate-y-0 focus:opacity-100"
      >
        Conteúdo
      </a>

      <header className="fixed left-0 right-0 top-0 z-40 border-b border-white/[0.05] bg-[hsl(222,48%,3%)]/82 backdrop-blur-2xl">
        <div className="mx-auto flex h-[3.75rem] max-w-[1600px] items-center gap-3 px-5 md:gap-6 md:px-10 xl:px-14">
          <a
            href="#inicio"
            className="shrink-0 font-display text-[13px] font-extrabold tracking-[0.12em] text-foreground transition-opacity hover:opacity-90"
          >
            BRASIL
            <span className="text-gold">·</span>
          </a>
          <div className="hidden min-w-0 flex-1 justify-center md:flex">
            <SiteNavDesktop />
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
            <span className="hidden text-[9px] font-semibold uppercase tracking-[0.38em] text-gold/88 transition-colors hover:text-gold-bright sm:inline">
              Edição especial
            </span>
            <SiteNavMobile />
          </div>
        </div>
      </header>

      <main id="main" className="relative flex-1 pb-24 md:pb-0">
        <HeroSection
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
          onBuy={openPurchase}
        />
        <ProductSpotlight />
        <WhyDifferent />
        <PremiumGallery />
        <SocialProof />
        <SizeChart />
        <FaqSection />
        <FinalCta onBuy={openPurchase} />
      </main>

      <footer className="relative border-t border-white/[0.05] bg-gradient-to-b from-transparent to-[#04070d]/90 py-14 text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          © {new Date().getFullYear()} Brasil Estilizada
        </p>
        <p className="mx-auto mt-4 max-w-sm text-xs leading-relaxed text-muted-foreground/85">
          Página de produto único. Pagamento Pix integrado em breve ao fluxo de checkout.
        </p>
      </footer>

      <StickyBuyBar onBuy={openPurchase} />
      <PurchaseDialog
        open={purchaseOpen}
        onOpenChange={setPurchaseOpen}
        initialSize={selectedSize}
      />
    </>
  );
}
