"use client";

import { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { HeroSection } from "@/components/landing/hero-section";
import { ProductDetails } from "@/components/landing/product-details";
import { PremiumGallery } from "@/components/landing/premium-gallery";
import { SocialProof } from "@/components/landing/social-proof";
import { SizeChart } from "@/components/landing/size-chart";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCta } from "@/components/landing/final-cta";
import { StickyBuyBar } from "@/components/landing/sticky-buy-bar";
import { SiteNavDesktop, SiteNavMobile, CartButton } from "@/components/landing/site-nav";
import { CartDialog } from "@/components/purchase/cart-dialog";
import { PRODUCT, PRODUCT_IMAGE_SRC } from "@/lib/product";
import type { Size, CartItem } from "@/lib/types";

export default function HomePage() {
  const [selectedSize, setSelectedSize] = useState<Size>("M");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const handleAddToCart = () => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.size === selectedSize);
      if (existingItem) {
        return prevCart.map((item) =>
          item.size === selectedSize ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prevCart,
        {
          id: `${PRODUCT.id}-${selectedSize}`,
          name: PRODUCT.name,
          imageSrc: PRODUCT_IMAGE_SRC,
          priceCents: PRODUCT.priceCents,
          priceFormatted: PRODUCT.priceFormatted,
          size: selectedSize,
          quantity: 1,
        },
      ];
    });
    toast.success(`${PRODUCT.shortName} (Tam: ${selectedSize}) adicionada ao carrinho!`);
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item))
    );
  };

  const removeCartItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

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
            <div className="hidden md:flex">
              <CartButton onCartOpen={() => setCartOpen(true)} cartCount={cartCount} />
            </div>
            <SiteNavMobile onCartOpen={() => setCartOpen(true)} cartCount={cartCount} />
          </div>
        </div>
      </header>

      <main id="main" className="relative flex-1 pb-24 md:pb-0">
        <HeroSection
          selectedSize={selectedSize}
          onSizeChange={setSelectedSize}
          onAddToCart={handleAddToCart}
        />
        <ProductDetails />
        <PremiumGallery />
        <SocialProof />
        <SizeChart />
        <FaqSection />
        <FinalCta onAddToCart={handleAddToCart} />
      </main>

      <footer className="relative border-t border-white/[0.05] bg-gradient-to-b from-transparent to-[#04070d]/90 py-14 text-center">
        <div className="flex justify-center gap-6 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <a href="#" className="transition-colors hover:text-gold">Envios</a>
          <a href="#" className="transition-colors hover:text-gold">Trocas</a>
          <a href="#" className="transition-colors hover:text-gold">Contacto</a>
        </div>
        <p className="mt-8 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          © {new Date().getFullYear()} Brasil Estilizada
        </p>
        <p className="mx-auto mt-4 max-w-sm text-xs leading-relaxed text-muted-foreground/85">
          Página de produto único. Pagamento Pix integrado em breve ao fluxo de checkout.
        </p>
      </footer>

      <StickyBuyBar onAddToCart={handleAddToCart} />
      <CartDialog
        open={cartOpen}
        onOpenChange={setCartOpen}
        items={cart}
        updateQuantity={updateCartQuantity}
        removeItem={removeCartItem}
      />
    </>
  );
}