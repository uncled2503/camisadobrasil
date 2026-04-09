"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PRODUCT, PRODUCT_IMAGE_SRC, SIZES, type Size } from "@/lib/product";
import { handleBuyNow } from "@/lib/purchase-handlers";
import { cn } from "@/lib/utils";
import { Minus, Plus, ShieldCheck } from "lucide-react";

type PurchaseDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialSize: Size;
};

export function PurchaseDialog({
  open,
  onOpenChange,
  initialSize,
}: PurchaseDialogProps) {
  const [size, setSize] = useState<Size>(initialSize);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (open) {
      setSize(initialSize);
    }
  }, [open, initialSize]);

  const totalCents = PRODUCT.priceCents * qty;
  const totalFormatted = useMemo(() => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(totalCents / 100);
  }, [totalCents]);

  const onConfirm = () => {
    handleBuyNow({
      size,
      quantity: qty,
      unitPriceCents: PRODUCT.priceCents,
      productId: PRODUCT.id,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-white/[0.08] bg-[hsl(222,38%,7%)]/98 shadow-luxe backdrop-blur-2xl sm:max-w-md sm:rounded-[1.5rem]">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-semibold tracking-tight">
            Finalizar pedido
          </DialogTitle>
          <DialogDescription>
            Confirme tamanho e quantidade. O pagamento via Pix será integrado em breve.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4 shadow-luxe">
          <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-white/[0.08]">
            <Image
              src={PRODUCT_IMAGE_SRC}
              alt={PRODUCT.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm font-semibold text-foreground">
              {PRODUCT.name}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Edição especial · estoque limitado
            </p>
            <p className="mt-2 text-sm font-semibold tabular-nums text-gold-bright">
              {PRODUCT.priceFormatted}
            </p>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Tamanho
          </p>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={cn(
                  "min-h-11 min-w-11 rounded-xl border px-3 text-sm font-semibold transition-all duration-300",
                  size === s
                    ? "border-gold/50 bg-gold/12 text-gold-bright shadow-gold-soft"
                    : "border-white/[0.1] text-muted-foreground hover:border-gold/25 hover:text-foreground"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Quantidade
          </p>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="subtle"
              size="icon"
              className="shrink-0"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Diminuir quantidade"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="min-w-[2ch] text-center text-lg font-semibold tabular-nums">
              {qty}
            </span>
            <Button
              type="button"
              variant="subtle"
              size="icon"
              className="shrink-0"
              onClick={() => setQty((q) => Math.min(10, q + 1))}
              aria-label="Aumentar quantidade"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

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
          onClick={onConfirm}
        >
          Ir para pagamento Pix
        </Button>

        <p className="flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5 text-pitch" aria-hidden />
          Ambiente preparado para checkout seguro. Integração Pix em breve.
        </p>
      </DialogContent>
    </Dialog>
  );
}
