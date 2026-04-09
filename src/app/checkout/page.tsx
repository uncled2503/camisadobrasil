"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { 
  ChevronLeft, 
  Lock, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Truck, 
  Star, 
  TicketPercent, 
  PenTool, 
  Gift, 
  ShieldAlert, 
  Users, 
  Award, 
  Key,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCT, PRODUCT_IMAGE_MAIN_SRC } from "@/lib/product";
import { cn } from "@/lib/utils";

const SectionHeader = ({ number, title }: { number: number; title: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-navy-deep font-bold text-sm">
      {number}
    </div>
    <h2 className="font-display text-lg font-bold uppercase tracking-tight text-white">{title}</h2>
  </div>
);

const InputGroup = ({ label, placeholder, type = "text", className }: { label: string; placeholder: string; type?: string; className?: string }) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground pl-1">{label}</label>
    <input 
      type={type}
      placeholder={placeholder}
      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white placeholder:text-muted-foreground/40 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
    />
  </div>
);

const ORDER_BUMPS = [
  {
    id: "personalization",
    title: "Personalização Nome + Número",
    offer: "Adicione seu nome e número favorito nas costas com a fonte oficial da edição.",
    priceCents: 2990,
    icon: PenTool
  },
  {
    id: "luxury_box",
    title: "Embalagem de Luxo Alpha Collector",
    offer: "Adicione nossa caixa premium com acabamento em hot-stamping dourado e papel seda.",
    priceCents: 1990,
    icon: Gift
  },
  {
    id: "shipping_insurance",
    title: "Seguro Entrega Blindada",
    offer: "Proteção total contra roubo ou extravio + Prioridade máxima no despacho.",
    priceCents: 990,
    icon: ShieldAlert
  },
  {
    id: "gift_second_unit",
    title: "Presente com Desconto Progressivo",
    offer: "Leve a 2ª unidade (para presente) por apenas R$ 49,00 adicionais com embrulho.",
    priceCents: 4900,
    icon: Users
  },
  {
    id: "champion_patch",
    title: "Patch de Campeão (Bordado)",
    offer: "Patch comemorativo de Campeão do Mundo aplicado na manga (veludo e dourado).",
    priceCents: 1290,
    icon: Award
  },
  {
    id: "gold_keychain",
    title: "Chaveiro Réplica Escudo Dourado",
    offer: "Chaveiro oficial em metal polido banhado a ouro. Um detalhe para o seu dia a dia.",
    priceCents: 990,
    icon: Key
  }
];

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [selectedBumps, setSelectedBumps] = useState<string[]>([]);
  const searchParams = useSearchParams();
  
  const quantity = parseInt(searchParams.get("q") || "1", 10);
  
  const toggleBump = (id: string) => {
    setSelectedBumps(prev => 
      prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]
    );
  };

  const pricing = useMemo(() => {
    const unitPrice = PRODUCT.priceCents;
    const subtotal = unitPrice * quantity;
    const freeItems = Math.floor(quantity / 3);
    const itemDiscount = freeItems * unitPrice;
    
    const bumpsTotal = ORDER_BUMPS
      .filter(b => selectedBumps.includes(b.id))
      .reduce((sum, b) => sum + b.priceCents, 0);

    const total = subtotal - itemDiscount + bumpsTotal;

    const format = (cents: number) => 
      new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

    return {
      subtotalCents: subtotal,
      subtotal: format(subtotal),
      discount: format(itemDiscount),
      discountValue: itemDiscount,
      bumpsTotalCents: bumpsTotal,
      bumpsTotal: format(bumpsTotal),
      totalCents: total,
      total: format(total),
      quantity,
    };
  }, [quantity, selectedBumps]);

  return (
    <div className="min-h-screen bg-[#04070d] text-foreground pb-20">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 py-1.5 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">
          🔥 Oferta por tempo limitado! Frete Grátis Ativado.
        </p>
      </div>

      <header className="border-b border-white/5 bg-navy-deep/50 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors">
            <ChevronLeft size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Voltar à loja</span>
          </Link>
          <p className="font-display text-xs font-bold tracking-[0.3em] text-gold-bright">ALPHA BRASIL</p>
          <div className="w-24 flex justify-end">
            <Lock size={16} className="text-muted-foreground/40" />
          </div>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-7xl px-5 lg:mt-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-8">
            <section className="glass-dark rounded-[2rem] p-6 md:p-8">
              <SectionHeader number={1} title="Dados Pessoais" />
              <div className="grid gap-4 md:grid-cols-2">
                <InputGroup label="Nome Completo" placeholder="Digite seu nome completo" className="md:col-span-2" />
                <InputGroup label="E-mail" placeholder="seu@email.com" type="email" />
                <InputGroup label="WhatsApp" placeholder="(00) 00000-0000" />
                <InputGroup label="CPF" placeholder="000.000.000-00" className="md:col-span-2" />
              </div>
            </section>

            <section className="glass-dark rounded-[2rem] p-6 md:p-8">
              <SectionHeader number={2} title="Endereço de Entrega" />
              <div className="grid gap-4 md:grid-cols-3">
                <InputGroup label="CEP" placeholder="00000-000" />
                <InputGroup label="Cidade" placeholder="Sua cidade" className="md:col-span-2" />
                <InputGroup label="Endereço" placeholder="Rua, Avenida..." className="md:col-span-2" />
                <InputGroup label="Número" placeholder="123" />
                <InputGroup label="Bairro" placeholder="Nome do bairro" />
                <InputGroup label="Complemento" placeholder="Apto, Bloco (Opcional)" className="md:col-span-2" />
              </div>
            </section>

            {/* Passo 3: Order Bumps */}
            <section className="glass-dark rounded-[2rem] p-6 md:p-8">
              <SectionHeader number={3} title="Turbine seu Pedido" />
              <p className="mb-6 text-xs text-muted-foreground uppercase tracking-widest font-semibold">Ofertas exclusivas de checkout:</p>
              <div className="grid gap-3">
                {ORDER_BUMPS.map((bump) => {
                  const isSelected = selectedBumps.includes(bump.id);
                  const Icon = bump.icon;
                  return (
                    <button
                      key={bump.id}
                      onClick={() => toggleBump(bump.id)}
                      className={cn(
                        "group relative flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300",
                        isSelected 
                          ? "border-gold/60 bg-gold/10 ring-1 ring-gold/40 shadow-[0_0_20px_rgba(212,175,55,0.15)]" 
                          : "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                      )}
                    >
                      <div className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors",
                        isSelected ? "bg-gold text-navy-deep" : "bg-white/5 text-gold/60 group-hover:text-gold"
                      )}>
                        <Icon size={24} />
                      </div>
                      <div className="flex-1 pr-8">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white tracking-tight">{bump.title}</h4>
                          <span className="text-xs font-black text-gold-bright">
                            + {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(bump.priceCents / 100)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{bump.offer}</p>
                      </div>
                      <div className={cn(
                        "absolute right-4 flex h-6 w-6 items-center justify-center rounded-full border transition-all",
                        isSelected ? "bg-gold border-gold" : "border-white/10"
                      )}>
                        {isSelected && <Check size={14} className="text-navy-deep font-bold" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="glass-dark rounded-[2rem] p-6 md:p-8">
              <SectionHeader number={4} title="Pagamento" />
              <div className="grid grid-cols-2 gap-3 mb-8">
                <button 
                  onClick={() => setPaymentMethod("pix")}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-2xl border p-4 transition-all",
                    paymentMethod === "pix" 
                      ? "border-gold bg-gold/5 ring-1 ring-gold" 
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  )}
                >
                  <QrCode size={24} className={paymentMethod === "pix" ? "text-gold" : "text-muted-foreground"} />
                  <span className={cn("text-xs font-bold uppercase tracking-widest", paymentMethod === "pix" ? "text-gold" : "text-muted-foreground")}>PIX</span>
                </button>
                <button 
                   onClick={() => setPaymentMethod("card")}
                  className={cn(
                    "flex flex-col items-center gap-3 rounded-2xl border p-4 transition-all",
                    paymentMethod === "card" 
                      ? "border-gold bg-gold/5 ring-1 ring-gold" 
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  )}
                >
                  <CreditCard size={24} className={paymentMethod === "card" ? "text-gold" : "text-muted-foreground"} />
                  <span className={cn("text-xs font-bold uppercase tracking-widest", paymentMethod === "card" ? "text-gold" : "text-muted-foreground")}>Cartão</span>
                </button>
              </div>

              {paymentMethod === "pix" ? (
                <div className="space-y-4">
                  <div className="rounded-2xl bg-green-500/10 border border-green-500/20 p-4 flex gap-4">
                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-green-500/20 text-green-500">
                      <QrCode size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">Aprovação Imediata</p>
                      <p className="mt-1 text-xs text-muted-foreground">O código PIX será gerado após clicar em "Finalizar Compra"</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  <InputGroup label="Número do Cartão" placeholder="0000 0000 0000 0000" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Validade" placeholder="MM/AA" />
                    <InputGroup label="CVV" placeholder="123" />
                  </div>
                  <InputGroup label="Nome no Cartão" placeholder="Como no cartão" />
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground pl-1">Parcelas</label>
                    <select className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50">
                      <option>1x de {pricing.total} sem juros</option>
                      <option>Até 12x no cartão</option>
                    </select>
                  </div>
                </div>
              )}
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="glass-dark rounded-[2rem] p-6 md:p-8">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight text-white mb-6">Resumo do Pedido</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Camisas ({pricing.quantity} un)</span>
                  <span className="text-white font-medium">{pricing.subtotal}</span>
                </div>
                
                {pricing.discountValue > 0 && (
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-green-500 font-bold">
                      <TicketPercent size={14} />
                      Oferta Leve 3 Pague 2
                    </div>
                    <span className="text-green-500 font-bold">- {pricing.discount}</span>
                  </div>
                )}

                {pricing.bumpsTotalCents > 0 && (
                  <div className="flex justify-between text-sm animate-in fade-in slide-in-from-top-1">
                    <span className="text-gold font-semibold">Complementos de Elite</span>
                    <span className="text-gold font-bold">+ {pricing.bumpsTotal}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-green-500 font-bold uppercase tracking-widest text-[10px]">Grátis</span>
                </div>
                <div className="h-px bg-white/10 my-6" />
                <div className="flex justify-between items-end">
                  <span className="font-display text-lg font-bold text-white uppercase tracking-tight">Total</span>
                  <span className="font-display text-3xl font-bold text-gold-bright tracking-tight">{pricing.total}</span>
                </div>
              </div>

              <Button size="xl" className="shimmer-btn w-full font-bold uppercase tracking-widest py-8 rounded-2xl">
                Finalizar Compra
              </Button>

              <div className="mt-8 space-y-4 border-t border-white/5 pt-8">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <ShieldCheck size={16} className="text-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Garantia de Satisfação</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Lock size={16} className="text-gold" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Checkout Seguro SSL</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}