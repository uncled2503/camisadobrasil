"use client";

import Image from "next/image";
import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/lib/types";
import { handleBuyNow } from "@/lib/purchase-handlers";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

type CartDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
};

export function CartDialog({
  open,
  onOpenChange,
  items,
  updateQuantity,
  removeItem,
}: CartDialogProps) {
  const totalCents = useMemo(
    () => items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0),
    [items]
  );

  const totalFormatted = useMemo(() => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(totalCents / 100);
  }, [totalCents]);

  const onCheckout = () => {
    // Placeholder for checkout logic
    console.info("Proceeding to checkout with items:", items);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/[0.08] bg-[hsl(222,38%,7%)]/98 shadow-luxe backdrop-blur-2xl sm:max-w-lg sm:rounded-[1.5rem]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 font-display text-xl font-semibold tracking-tight">
            <ShoppingCart className="h-5 w-5 text-gold" />
            Carrinho de compras
          </DialogTitle>
          <DialogDescription>
            Confirme os itens antes de ir para o pagamento.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 pr-2">
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">O seu carrinho está vazio.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-white/[0.08]">
                  <Image
                    src={item.imageSrc}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-sm font-semibold text-foreground">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Tamanho: {item.size}</p>
                  <p className="mt-2 text-sm font-semibold tabular-nums text-gold-bright">
                    {item.priceFormatted}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="subtle"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      aria-label="Diminuir quantidade"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </Button>
                    <span className="min-w-[2ch] text-center text-base font-semibold tabular-nums">
                      {item.quantity}
                    </span>
                    <Button
                      type="button"
                      variant="subtle"
                      size="icon"
                      className="h-7 w-7 shrink-0"
                      onClick={() => updateQuantity(item.id, Math.min(10, item.quantity + 1))}
                      aria-label="Aumentar quantidade"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="subtle"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-red-400"
                    onClick={() => removeItem(item.id)}
                    aria-label="Remover item"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <>
            <div className="space-y-3 rounded-2xl border border-white/[0.08] bg-gradient-to-br from-gold/[0.07] via-transparent to-transparent p-5 shadow-luxe">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums text-foreground">{totalFormatted}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="font-display text-base font-semibold">Total</span>
                <span className="font-display text-lg font-bold tabular-nums text-gold-bright">
                  {totalFormatted}
                </span>
              </div>
            </div>

            <Button
              type="button"
              size="lg"
              className="w-full uppercase tracking-[0.12em]"
              onClick={onCheckout}
            >
              Finalizar Compra
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}