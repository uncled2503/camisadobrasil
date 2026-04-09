"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
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
  Check,
  Timer,
  Mail,
  ShieldEllipsis,
  Hash,
  User as UserIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCT } from "@/lib/product";
import { cn } from "@/lib/utils";

// Funções de máscara para campos de formulário
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
  maxLength,
  icon: Icon
}: { 
  label: string; 
  placeholder: string; 
  type?: string; 
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  icon?: any;
}) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground pl-1">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/40" />}
      <input 
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        className={cn(
          "h-12 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white placeholder:text-muted-foreground/40 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all",
          Icon && "pl-11"
        )}
      />
    </div>
  </div>
);

const ORDER_BUMPS = [
  { 
    id: "personalization", 
    title: "Personalização Nome + Número", 
    offer: "Fonte oficial da edição nas costas da camisa.", 
    priceCents: 2990, 
    image: "/images/bumps/name.png" 
  },
  { 
    id: "second_shirt", 
    title: "Leve a 2ª para Presente", 
    offer: "Com embrulho incluso. Ideal para irmão ou pai.", 
    priceCents: 4900, 
    image: "/images/bumps/shirt.png" 
  },
  { 
    id: "patch", 
    title: "Patch de Campeão Premium", 
    offer: "Acabamento em veludo e dourado na manga.", 
    priceCents: 1290, 
    image: "/images/bumps/patch.png" 
  },
  { 
    id: "luxury_box", 
    title: "Embalagem Alpha Collector", 
    offer: "Caixa premium com hot-stamping e papel seda.", 
    priceCents: 1990, 
    image: "/images/bumps/box.png" 
  },
  { 
    id: "keychain", 
    title: "Chaveiro Réplica Escudo", 
    offer: "Metal polido banhado a ouro.", 
    priceCents: 990, 
    image: "/images/bumps/keychain.png" 
  },
  { 
    id: "shipping_insurance", 
    title: "Entrega Blindada", 
    offer: "Proteção total e prioridade máxima no despacho.", 
    priceCents: 990, 
    image: "/images/bumps/insurance.png" 
  },
];

function CheckoutContent() {
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [selectedBumps, setSelectedBumps] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(899); // 14:59
  
  // Estados para personalização
  const [customName, setCustomName] = useState("");
  const [customNumber, setCustomNumber] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    confirmEmail: "",
    phone: "",
    cpf: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVV: "",
    cardName: ""
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

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
    if (selectedBumps.includes("personalization") && (!customName || !customNumber)) {
      toast.error("Por favor, preencha o Nome e Número para a personalização.");
      return;
    }

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
    toast.success("Gerando seu código Pix de pagamento...");
  };

  return (
    <div className="min-h-screen bg-[#04070d] text-foreground pb-20">
      {/* Barra de Urgência */}
      <div className="sticky top-0 z-50 flex items-center justify-center gap-3 bg-gradient-to-r from-gold-deep via-gold to-gold-deep py-2 text-navy-deep shadow-lg">
        <Timer size={14} className="animate-pulse" />
        <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
          Garanta o desconto especial agora! <span className="ml-2 font-mono tabular-nums">{formatTime(timeLeft)}</span>
        </p>
      </div>

      <header className="border-b border-white/5 bg-navy-deep/50 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-gold transition-colors">
            <ChevronLeft size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Voltar</span>
          </Link>
          <p className="font-display text-xs font-bold tracking-[0.3em] text-gold-bright">ALPHA BRASIL</p>
          <Lock size={16} className="text-muted-foreground/40" />
        </div>
      </header>

      <main className="mx-auto mt-8 max-w-7xl px-5 lg:mt-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          <div className="space-y-8">
            <div className="glass-dark flex items-center justify-between rounded-2xl px-6 py-4">
              <div className="flex items-center gap-3">
                <Truck className="text-gold" size={20} />
                <p className="text-xs font-bold uppercase tracking-widest text-white/90">Você está adquirindo:</p>
              </div>
              <p className="text-xs font-bold text-gold-bright">{PRODUCT.name} ({pricing.quantity} un)</p>
            </div>

            <section className="glass-dark rounded-[2rem] p-6 md:p-8">
              <SectionHeader number={1} title="Dados Pessoais" />
              <div className="grid gap-4 md:grid-cols-2">
                <InputGroup label="Nome Completo" placeholder="Digite seu nome completo" className="md:col-span-2" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
                <InputGroup label="E-mail" placeholder="seu@email.com" type="email" icon={Mail} value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                <InputGroup label="WhatsApp" placeholder="(00) 00000-0000" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value, maskPhone)} maxLength={15} />
                <InputGroup label="CPF ou CNPJ" placeholder="000.000.000-00" value={formData.cpf} onChange={(e) => handleInputChange("cpf", e.target.value, maskCPF)} maxLength={14} />
              </div>
            </section>

            <section className="glass-dark rounded-[2rem] p-6 md:p-8">
              <SectionHeader number={2} title="Pagamento" />
              <div className="mb-8 grid grid-cols-2 gap-3">
                <button onClick={() => setPaymentMethod("card")} className={cn("flex flex-col items-center gap-2 rounded-xl border py-4 transition-all", paymentMethod === "card" ? "border-gold bg-gold/5 ring-1 ring-gold" : "border-white/5 bg-white/[0.02] hover:border-white/10")}>
                  <CreditCard size={20} className={paymentMethod === "card" ? "text-gold" : "text-muted-foreground/60"} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Cartão</span>
                </button>
                <button onClick={() => setPaymentMethod("pix")} className={cn("flex flex-col items-center gap-2 rounded-xl border py-4 transition-all", paymentMethod === "pix" ? "border-gold bg-gold/5 ring-1 ring-gold" : "border-white/5 bg-white/[0.02] hover:border-white/10")}>
                  <QrCode size={20} className={paymentMethod === "pix" ? "text-gold" : "text-muted-foreground/60"} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">PIX</span>
                </button>
              </div>

              {paymentMethod === "pix" ? (
                <div className="space-y-4 rounded-2xl bg-white/[0.02] p-6 border border-white/5">
                  <div className="flex items-center gap-2 text-gold-bright mb-4">
                    <QrCode size={20} />
                    <p className="text-sm font-bold uppercase tracking-widest">Instruções do Pix</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Pagamento 100% seguro e processado instantaneamente para garantir o envio imediato.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  <InputGroup label="Número do Cartão" placeholder="0000 0000 0000 0000" />
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Validade" placeholder="MM/AA" />
                    <InputGroup label="CVV" placeholder="123" />
                  </div>
                  <InputGroup label="Nome no Cartão" placeholder="Como no cartão" />
                </div>
              )}
            </section>

            <section className="glass-dark overflow-hidden rounded-[2rem] p-0">
              <div className="bg-green-600/10 px-6 py-2 border-b border-green-500/20">
                <span className="text-[10px] font-bold uppercase tracking-widest text-green-400">🔥 OPORTUNIDADE ÚNICA</span>
              </div>
              <div className="p-6 md:p-8">
                <SectionHeader number={3} title="Adicione ao seu Pedido" />
                <div className="grid gap-4">
                  {ORDER_BUMPS.map((bump) => {
                    const isSelected = selectedBumps.includes(bump.id);
                    const isPersonalization = bump.id === "personalization";

                    return (
                      <div 
                        key={bump.id} 
                        className={cn(
                          "group flex flex-col overflow-hidden rounded-2xl border transition-all", 
                          isSelected ? "border-gold/60 bg-gold/5 ring-1 ring-gold/40 shadow-gold/5" : "border-white/5 bg-white/[0.02] hover:bg-white/[0.04]"
                        )}
                      >
                        <button 
                          onClick={() => toggleBump(bump.id)} 
                          className="flex w-full items-center gap-4 p-4 text-left"
                        >
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/10">
                            <Image src={bump.image} alt={bump.title} fill className="object-cover" sizes="64px" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-white">{bump.title}</h4>
                            <p className="text-[10px] text-muted-foreground mt-0.5">{bump.offer}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-gold-bright uppercase">
                              + {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(bump.priceCents / 100)}
                            </p>
                            <div className={cn(
                              "ml-auto mt-2 flex h-5 w-5 items-center justify-center rounded border", 
                              isSelected ? "bg-gold border-gold" : "border-white/10"
                            )}>
                              {isSelected && <Check size={12} className="text-navy-deep font-bold" />}
                            </div>
                          </div>
                        </button>

                        {/* Campos de Input para Personalização */}
                        {isPersonalization && isSelected && (
                          <div className="grid grid-cols-1 gap-4 border-t border-white/5 bg-white/[0.02] p-5 sm:grid-cols-2">
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-bold uppercase tracking-widest text-gold/70 pl-1">Nome na Camisa</label>
                              <div className="relative">
                                <UserIcon className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold/40" />
                                <input 
                                  type="text"
                                  placeholder="Ex: NEYMAR JR"
                                  value={customName}
                                  onChange={(e) => setCustomName(e.target.value.toUpperCase())}
                                  className="h-10 w-full rounded-lg border border-gold/20 bg-[#060a12] pl-10 pr-4 text-xs font-bold text-white placeholder:text-muted-foreground/30 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50"
                                />
                              </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[9px] font-bold uppercase tracking-widest text-gold/70 pl-1">Número</label>
                              <div className="relative">
                                <Hash className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold/40" />
                                <input 
                                  type="text"
                                  placeholder="Ex: 10"
                                  maxLength={2}
                                  value={customNumber}
                                  onChange={(e) => setCustomNumber(e.target.value.replace(/\D/g, ""))}
                                  className="h-10 w-full rounded-lg border border-gold/20 bg-[#060a12] pl-10 pr-4 text-xs font-bold text-white placeholder:text-muted-foreground/30 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="glass-dark overflow-hidden rounded-[2rem] p-6 md:p-8">
              <div className="relative mb-6 aspect-square w-full overflow-hidden rounded-2xl border border-white/10 shadow-lg">
                <Image src="/images/camisa-checkout-display.png" alt="Sua Edição Sagrada" fill className="object-cover" priority />
              </div>
              <h3 className="font-display text-lg font-bold uppercase tracking-tight text-white mb-6">Resumo da Compra</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal ({pricing.quantity} un)</span>
                  <span className="text-white">{new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(pricing.subtotal / 100)}</span>
                </div>
                {pricing.discountValue > 0 && (
                  <div className="flex justify-between text-sm text-green-400 font-bold">
                    <span>Oferta Especial</span>
                    <span>- {pricing.discount}</span>
                  </div>
                )}
                {selectedBumps.length > 0 && (
                  <div className="flex justify-between text-sm text-gold font-bold">
                    <span>Adicionais</span>
                    <span>+ {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(pricing.bumpsTotal / 100)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="text-green-400 uppercase tracking-widest text-[10px]">Grátis</span>
                </div>
                <div className="h-px bg-white/10 my-6" />
                <div className="flex justify-between items-end">
                  <span className="font-display text-lg font-bold text-white">Total Hoje:</span>
                  <span className="font-display text-3xl font-bold text-gold-bright tracking-tight">{pricing.total}</span>
                </div>
              </div>
              <Button size="xl" onClick={handleFinalize} className="shimmer-btn w-full font-bold uppercase tracking-widest py-8 rounded-2xl">Finalizar Compra</Button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#04070d] flex items-center justify-center"><p className="text-gold font-display animate-pulse">CARREGANDO CHECKOUT...</p></div>}>
      <CheckoutContent />
    </Suspense>
  );
}