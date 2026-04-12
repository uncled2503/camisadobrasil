"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Minus, Plus, ShoppingBag, Truck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PRODUCT, PRODUCT_IMAGE_CLEAN_SRC, SIZES } from "@/lib/product";
import type { Size } from "@/lib/types";
import { serializeOrderSizes } from "@/lib/cart-sizes";
import { leve3Pague2DiscountCents } from "@/lib/offer-pricing";
import { useCheckoutTransition } from "@/components/navigation/checkout-transition-provider";
import { cn } from "@/lib/utils";

type LandingCartDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quantity: number;
  onQuantityChange: (q: number) => void;
  sizes: Size[];
  onSizesChange: (sizes: Size[]) => void;
};

export function LandingCartDialog({
  open,
  onOpenChange,
  quantity,
  onQuantityChange,
  sizes,
  onSizesChange,
}: LandingCartDialogProps) {
  const { requestCheckoutNavigation } = useCheckoutTransition();
  const safeQty = quantity < 1 ? 1 : quantity;
  const lineSizes = sizes.length === safeQty ? sizes : Array.from({ length: safeQty }, (_, i) => sizes[i] ?? "M");

  const pricing = useMemo(() => {
    const unitPrice = PRODUCT.priceCents;
    const subtotal = unitPrice * safeQty;
    const itemDiscount = leve3Pague2DiscountCents(safeQty, unitPrice);
    const totalCents = subtotal - itemDiscount;
    const fmt = (cents: number) =>
      new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);
    return {
      subtotalFormatted: fmt(subtotal),
      discountValue: itemDiscount,
      discountFormatted: fmt(itemDiscount),
      totalFormatted: fmt(totalCents),
    };
  }, [safeQty]);

  const checkoutParams = new URLSearchParams();
  checkoutParams.set("q", String(safeQty));
  checkoutParams.set("sizes", serializeOrderSizes(lineSizes));

  const bumpQty = (delta: number) => {
    onQuantityChange(Math.max(1, Math.min(99, safeQty + delta)));
  };

  const setSizeAt = (index: number, s: Size) => {
    const next = [...lineSizes];
    next[index] = s;
    onSizesChange(next);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className={cn(
          "fixed left-auto right-0 top-0 flex h-[100dvh] max-h-[100dvh] w-full max-w-md translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden border-l border-white/10 bg-[#060a12] p-0 shadow-2xl",
          "data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right",
          "data-[state=open]:zoom-in-100 data-[state=closed]:zoom-out-100",
          "sm:rounded-none"
        )}
      >
        <div className="flex flex-1 flex-col overflow-y-auto">
          <DialogHeader className="border-b border-white/[0.06] px-6 pb-4 pt-6 text-left">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold text-navy-deep">
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={2.25} aria-hidden />
              </div>
              <div>
                <DialogTitle className="font-display text-lg uppercase tracking-tight text-white">
                  Carrinho
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Revise o seu pedido antes de finalizar
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-1 flex-col gap-6 px-6 py-6">
            <div className="glass-dark overflow-hidden rounded-[1.5rem] border border-gold/20 p-5">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="relative mx-auto aspect-square w-full max-w-[140px] shrink-0 overflow-hidden rounded-xl border border-white/10">
                  <Image
                    src={PRODUCT_IMAGE_CLEAN_SRC}
                    alt={PRODUCT.name}
                    fill
                    className="object-cover"
                    sizes="140px"
                  />
                </div>
                <div className="min-w-0 flex-1 space-y-4">
                  <h2 className="font-display text-sm font-bold uppercase leading-snug tracking-tight text-white">
                    {PRODUCT.name}
                  </h2>

                  <div className="space-y-4">
                    {lineSizes.map((sz, index) => (
                      <div key={index} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {safeQty > 1 ? `Camisa ${index + 1} — tamanho` : "Tamanho"}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {SIZES.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => setSizeAt(index, s)}
                              className={cn(
                                "flex h-9 min-w-9 items-center justify-center rounded-lg px-2 text-[11px] font-bold transition-all",
                                sz === s
                                  ? "bg-gold text-navy-deep"
                                  : "border border-white/10 bg-white/[0.03] text-muted-foreground hover:border-gold/40"
                              )}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Quantidade
                    </p>
                    <div className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
                      <button
                        type="button"
                        onClick={() => bumpQty(-1)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="min-w-[2rem] text-center font-bold tabular-nums text-white">{safeQty}</span>
                      <button
                        type="button"
                        onClick={() => bumpQty(1)}
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/10"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2.5 text-[11px] leading-snug text-muted-foreground">
                    <Truck className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
                    <span>Frete grátis no checkout para este pedido.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-[1.25rem] border border-white/[0.06] bg-white/[0.02] px-5 py-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({safeQty} un)</span>
                <span className="text-white">{pricing.subtotalFormatted}</span>
              </div>
              {pricing.discountValue > 0 && (
                <div className="flex justify-between text-sm font-bold text-green-400">
                  <span>Oferta Leve 3, Pague 2 (não cumulativa)</span>
                  <span>- {pricing.discountFormatted}</span>
                </div>
              )}
              <div className="h-px bg-white/10" />
              <div className="flex items-end justify-between">
                <span className="font-display text-base font-bold text-white">Total</span>
                <span className="price-gold-glow font-display text-2xl font-bold tracking-tight text-gold-bright">
                  {pricing.totalFormatted}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-auto border-t border-white/[0.06] bg-[#04070d]/90 px-6 py-5 backdrop-blur-md">
            <Button
              type="button"
              size="xl"
              className="w-full rounded-2xl py-7 font-bold uppercase tracking-widest"
              onClick={() => {
                onOpenChange(false);
                requestCheckoutNavigation(checkoutParams.toString());
              }}
            >
              Ir para o checkout
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
