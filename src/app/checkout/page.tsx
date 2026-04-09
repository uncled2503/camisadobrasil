"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
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
import { PRODUCT } from "@/lib/product";
import { cn } from "@/lib/utils";

// Funções de máscara
const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};

const maskPhone = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{4})\d+?$/, "$1");
};

const maskCEP = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
};

const maskCardNumber = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{4})(\d)/, "$1 $2")
    .replace(/(\d{4})(\d)/, "$1 $2")
    .replace(/(\d{4})(\d)/, "$1 $2")
    .replace(/(\d{4})\d+?$/, "$1");
};

const maskExpiry = (value: string) => {
  return value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1/$2")
    .replace(/(\/\d{2})\d+?$/, "$1");
};

const SectionHeader = ({ number, title }: { number: number; title: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-navy-deep font-bold text-sm">
      {number}
    </div>
    <h2 className="font-display text-lg font-bold uppercase tracking-tight text-white">{title}</h2>
  </div>
);

const InputGroup = ({ 
  label, 
  placeholder, 
  type = "text", 
  className, 
  value, 
  onChange,
  maxLength 
}: { 
  label: string; 
  placeholder: string; 
  type?: string; 
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
}) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground pl-1">{label}</label>
    <input 
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      maxLength={maxLength}
      className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white placeholder:text-muted-foreground/40 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
    />
  </div>
);

const ORDER_BUMPS = [
  { id: "personalization", title: "Personalização Nome + Número", offer: "Adicione seu nome e número favorito nas costas com a fonte oficial da edição.", priceCents: 2990, icon: PenTool },
  { id: "luxury_box", title: "Embalagem de Luxo Alpha Collector", offer: "Adicione nossa caixa premium com acabamento em hot-stamping dourado e papel seda.", priceCents: 1990, icon: Gift },
  { id: "shipping_insurance", title: "Seguro Entrega Blindada", offer: "Proteção total contra roubo ou extravio + Prioridade máxima no despacho.", priceCents: 990, icon: ShieldAlert },
  { id: "gift_second_unit", title: "Presente com Desconto Progressivo", offer: "Leve a 2ª unidade (para presente) por apenas R$ 49,00 adicionais com embrulho.", priceCents: 4900, icon: Users },
  { id: "champion_patch", title: "Patch de Campeão (Bordado)", offer: "Patch comemorativo de Campeão do Mundo aplicado na manga (veludo e dourado).", priceCents: 1290, icon: Award },
  { id: "gold_keychain", title: "Chaveiro Réplica Escudo Dourado", offer: "Chaveiro oficial em metal polido banhado a ouro. Um detalhe para o seu dia a dia.", priceCents: 990, icon: Key }
];

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [selectedBumps, setSelectedBumps] = useState<string[]>([]);
  
  // Estados dos campos com máscara
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cpf: "",
    cep: "",
    city: "",
    address: "",
    number: "",
    neighborhood: "",
    complement: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
    cardName: ""
  });

  const searchParams = useSearchParams();
  const quantity = parseInt(searchParams.get("q") || "1", 10);
  
  const toggleBump = (id: string) => {
    setSelectedBumps(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  const pricing = useMemo(() => {
    const unitPrice = PRODUCT.priceCents;
    const subtotal = unitPrice * quantity;
    const freeItems = Math.floor(quantity / 3);
    const itemDiscount = freeItems * unitPrice;
    const bumpsTotal = ORDER_BUMPS.filter(b => selectedBumps.includes(b.id)).reduce((sum, b) => sum + b.priceCents, 0);
    const total = subtotal - itemDiscount + bumpsTotal;
    const format = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

    return { subtotal, discount: format(itemDiscount), discountValue: itemDiscount, bumpsTotal, total: format(total), quantity };
  }, [quantity, selectedBumps]);

  const handleInputChange = (field: keyof typeof formData, value: string, maskFn?: (v: string) => string) => {
    setFormData(prev => ({ ...prev, [field]: maskFn ? maskFn(value) : value }));
  };

  const handleFinalize = () => {
    if (paymentMethod === "card") {
      toast.error("Sistema de Cartão indisponível, refaça a compra via Pix por gentileza!", {
        duration: 5000,
        icon: '⚠️',
        style: {
          borderRadius: '12px',
          background: '#060a12',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '14px',
          fontWeight: '600'
        }
      });
      return;
    }
    
    // Lógica para Pix aqui (gerar QR Code etc)
    toast.success("Gerando seu código Pix de pagamento...", {
        style: {
          borderRadius: '12px',
          background: '#060a12',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }
    });
  };

  return (
    <div className="min-h-screen bg-[#04070d] text-foreground pb-20">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 py-1.5 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white">🔥 Oferta por tempo limitado! Frete Grátis Ativado.</p>
      </div>

      <header className="border-b border-white/5 bg-navy-deep/50 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors">
            <ChevronLeft size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Voltar à loja</span>
          </Link>
          <p className="font-display text-xs font-bold tracking-[0.3em] text-gold-bright">ALPHA BRASIL</p>
          <div className="w-24 flex justify-end"><Lock size={16} className="text-muted-foreground/40" /></div>
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-7xl px-5 lg:mt-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-8">
            <section className="glass-dark rounded-[2rem] p-6 md:p-8">
              <SectionHeader number={1} title="Dados Pessoais" />
              <div className="grid gap-4 md:grid-cols-2">
                <InputGroup label="Nome Completo" placeholder="Digite seu nome completo" className="md:col-span-2" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
                <InputGroup label="E-mail" placeholder="seu@email.com" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                <InputGroup label="WhatsApp" placeholder="(00) 00000-0000" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value, maskPhone)} maxLength={15} />
                <InputGroup label="CPF" placeholder="000.000.000-00" className="md:col-span-2" value={formData.cpf} onChange={(e) => handleInputChange("cpf", e.target.value, maskCPF)} maxLength={14} />
              </div>
            </section>

            <section className="glass-dark rounded-[2rem] p-6 md:p-8">
              <SectionHeader number={2} title="Endereço de Entrega" />
              <div className="grid gap-4 md:grid-cols-3">
                <InputGroup label="CEP" placeholder="00000-000" value={formData.cep} onChange={(e) => handleInputChange("cep", e.target.value, maskCEP)} maxLength={9} />
                <InputGroup label="Cidade" placeholder="Sua cidade" className="md:col-span-2" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} />
                <InputGroup label="Endereço" placeholder="Rua, Avenida..." className="md:col-span-2" value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} />
                <InputGroup label="Número" placeholder="123" value={formData.number} onChange={(e) => handleInputChange("number", e.target.value)} />
                <InputGroup label="Bairro" placeholder="Nome do bairro" value={formData.neighborhood} onChange={(e) => handleInputChange("neighborhood", e.target.value)} />
                <InputGroup label="Complemento" placeholder="Apto, Bloco (Opcional)" className="md:col-span-2" value={formData.complement} onChange={(e) => handleInputChange("complement", e.target.value)} />
              </div>
            </section>

            <section className="glass-dark rounded-[2rem] p-6 md:p-8">
              <SectionHeader number={3} title="Turbine seu Pedido" />
              <div className="grid gap-3">
                {ORDER_BUMPS.map((bump) => {
                  const isSelected = selectedBumps.includes(bump.id);
                  const Icon = bump.icon;
                  return (
                    <button key={bump.id} onClick={() => toggleBump(bump.id)} className={cn("group relative flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-300", isSelected ? "border-gold/60 bg-gold/10 ring-1 ring-gold/40 shadow-[0_0_20px_rgba(212,175,55,0.15)]" : "border-white/5 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]")}>
                      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors", isSelected ? "bg-gold text-navy-deep" : "bg-white/5 text-gold/60 group-hover:text-gold")}><Icon size={24} /></div>
                      <div className="flex-1 pr-8">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white tracking-tight">{bump.title}</h4>
                          <span className="text-xs font-black text-gold-bright">+ {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(bump.priceCents / 100)}</span>
                        </div>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{bump.offer}</p>
                      </div>
                      <div className={cn("absolute right-4 flex h-6 w-6 items-center justify-center rounded-full border transition-all", isSelected ? "bg-gold border-gold" : "border-white/10")}>{isSelected && <Check size={14} className="text-navy-deep font-bold" />}</div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="glass-dark rounded-[2rem] p-6 md:p-8">
              <SectionHeader number={4} title="Pagamento" />
              <div className="grid grid-cols-2 gap-3 mb-8">
                <button onClick={() => setPaymentMethod("pix")} className={cn("flex flex-col items-center gap-3 rounded-2xl border p-4 transition-all", paymentMethod === "pix" ? "border-gold bg-gold/5 ring-1 ring-gold" : "border-white/10 bg-white/[0.02] hover:border-white/20")}>
                  <QrCode size={24} className={paymentMethod === "pix" ? "text-gold" : "text-muted-foreground"} />
                  <span className={cn("text-xs font-bold uppercase tracking-widest", paymentMethod === "pix" ? "text-gold" : "text-muted-foreground")}>PIX</span>
                </button>
                <button onClick={() => setPaymentMethod("card")} className={cn("flex flex-col items-center gap-3 rounded-2xl border p-4 transition-all", paymentMethod === "card" ? "border-gold bg-gold/5 ring-1 ring-gold" : "border-white/10 bg-white/[0.02] hover:border-white/20")}>
                  <CreditCard size={24} className={paymentMethod === "card" ? "text-gold" : "text-muted-foreground"} />
                  <span className={cn("text-xs font-bold uppercase tracking-widest", paymentMethod === "card" ? "text-gold" : "text-muted-foreground")}>Cartão</span>
                </button>
              </div>

              {paymentMethod === "pix" ? (
                <div className="rounded-2xl bg-green-500/10 border border-green-500/20 p-4 flex gap-4">
                  <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-full bg-green-500/20 text-green-500"><QrCode size={20} /></div>
                  <div><p className="text-sm font-bold text-white">Aprovação Imediata</p><p className="mt-1 text-xs text-muted-foreground">O código PIX será gerado após clicar em "Finalizar Compra"</p></div>
                </div>
              ) : (
                <div className="grid gap-4">
                  <InputGroup label="Número do Cartão" placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={(e) => handleInputChange("cardNumber", e.target.value, maskCardNumber)} maxLength={19} />
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Validade" placeholder="MM/AA" value={formData.cardExpiry} onChange={(e) => handleInputChange("cardExpiry", e.target.value, maskExpiry)} maxLength={5} />
                    <InputGroup label="CVV" placeholder="123" value={formData.cardCVV} onChange={(e) => handleInputChange("cardCVV", e.target.value.replace(/\D/g, ""))} maxLength={4} />
                  </div>
                  <InputGroup label="Nome no Cartão" placeholder="Como no cartão" value={formData.cardName} onChange={(e) => handleInputChange("cardName", e.target.value)} />
                </div>
              )}
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="glass-dark rounded-[2rem] p-6 md:p-8">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight text-white mb-6">Resumo do Pedido</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Camisas ({pricing.quantity} un)</span><span className="text-white font-medium">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(pricing.subtotal / 100)}</span></div>
                {pricing.discountValue > 0 && <div className="flex justify-between text-sm"><div className="flex items-center gap-1.5 text-green-500 font-bold"><TicketPercent size={14} />Oferta Leve 3 Pague 2</div><span className="text-green-500 font-bold">- {pricing.discount}</span></div>}
                {selectedBumps.length > 0 && <div className="flex justify-between text-sm animate-in fade-in slide-in-from-top-1"><span className="text-gold font-semibold">Complementos de Elite</span><span className="text-gold font-bold">+ {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(pricing.bumpsTotal / 100)}</span></div>}
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Frete</span><span className="text-green-500 font-bold uppercase tracking-widest text-[10px]">Grátis</span></div>
                <div className="h-px bg-white/10 my-6" />
                <div className="flex justify-between items-end"><span className="font-display text-lg font-bold text-white uppercase tracking-tight">Total</span><span className="font-display text-3xl font-bold text-gold-bright tracking-tight">{pricing.total}</span></div>
              </div>
              <Button size="xl" onClick={handleFinalize} className="shimmer-btn w-full font-bold uppercase tracking-widest py-8 rounded-2xl">Finalizar Compra</Button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}