"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
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
  User as UserIcon,
  Loader2,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PRODUCT } from "@/lib/product";
import { parseOrderSizes } from "@/lib/cart-sizes";
import { leve3Pague2DiscountCents } from "@/lib/offer-pricing";
import { cn } from "@/lib/utils";
import { POS_COMPRA } from "@/lib/pos-compra-routes";
import {
  flagRetentionNavigationFromCheckout,
  getRetentionHref,
  RETENTION_PERCENT,
} from "@/lib/checkout-retention-storage";
import {
  useCheckoutBrowserBackRetention,
  useRetentionDiscountOnTotal,
  useRetentionBannerCountdown,
} from "@/hooks/use-checkout-retention";
import { extractPixGatewayPayload, qrDataUrlForImg } from "@/lib/pix-gateway-response";
import { savePosCompraPixClient } from "@/lib/pos-compra-pix-storage";

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

/** Só dígitos, blocos de 4 — o número completo não é enviado ao servidor, apenas os últimos 4. */
const maskCardNumber = (value: string) => {
  const d = value.replace(/\D/g, "").slice(0, 19);
  const parts: string[] = [];
  for (let i = 0; i < d.length; i += 4) {
    parts.push(d.slice(i, i + 4));
  }
  return parts.join(" ");
};

const maskCardExpiry = (value: string) => {
  const d = value.replace(/\D/g, "").slice(0, 4);
  if (d.length <= 2) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
};

const maskCVV = (value: string) => value.replace(/\D/g, "").slice(0, 4);

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
  autoComplete,
  icon: Icon
}: { 
  label: string; 
  placeholder: string; 
  type?: string; 
  className?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  autoComplete?: string;
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
        autoComplete={autoComplete}
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
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [selectedBumps, setSelectedBumps] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(899); // 14:59
  
  /** Nome e número por camisa (índice alinhado a `quantity` e `orderSizes`). */
  const [customNames, setCustomNames] = useState<string[]>([""]);
  const [customNumbers, setCustomNumbers] = useState<string[]>([""]);

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

  const [pixLoading, setPixLoading] = useState(false);
  const [cardSubmitting, setCardSubmitting] = useState(false);
  const [pixResult, setPixResult] = useState<{
    paymentCode: string;
    paymentCodeBase64: string;
    idTransaction?: string;
  } | null>(null);

  const pixQrDataUrl = useMemo(
    () => (pixResult?.paymentCodeBase64 ? qrDataUrlForImg(pixResult.paymentCodeBase64) : null),
    [pixResult?.paymentCodeBase64]
  );

  const searchParams = useSearchParams();
  const rawQ = parseInt(searchParams.get("q") || "1", 10);
  const quantity = Number.isFinite(rawQ) && rawQ > 0 ? rawQ : 1;
  const orderSizes = parseOrderSizes(searchParams, quantity);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setCustomNames((prev) =>
      Array.from({ length: quantity }, (_, i) => prev[i] ?? "")
    );
    setCustomNumbers((prev) =>
      Array.from({ length: quantity }, (_, i) => prev[i] ?? "")
    );
  }, [quantity]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const toggleBump = (id: string) => {
    setSelectedBumps(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);
  };

  /** Voltar do navegador: 1× por sessão → `/checkout/retencao` (lógica em `useCheckoutBrowserBackRetention`). */
  useCheckoutBrowserBackRetention();

  const pricing = useMemo(() => {
    const unitPrice = PRODUCT.priceCents;
    const subtotal = unitPrice * quantity;
    const itemDiscount = leve3Pague2DiscountCents(quantity, unitPrice);
    const bumpsTotal = selectedBumps.reduce((sum, id) => {
      const b = ORDER_BUMPS.find((x) => x.id === id);
      if (!b) return sum;
      if (id === "personalization") return sum + b.priceCents * quantity;
      return sum + b.priceCents;
    }, 0);
    const baseTotalCents = subtotal - itemDiscount + bumpsTotal;
    const format = (cents: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(cents / 100);

    return {
      subtotal,
      discount: format(itemDiscount),
      discountValue: itemDiscount,
      bumpsTotal,
      baseTotalCents,
      quantity,
    };
  }, [quantity, selectedBumps]);

  const retention = useRetentionDiscountOnTotal(pricing.baseTotalCents);
  const finalTotalCents = pricing.baseTotalCents - retention.discountCents;
  const retentionBannerLeft = useRetentionBannerCountdown(retention.untilMs);

  /** Só envia à raiz se o 30% de retenção já foi aceite e ainda está válido (faixa dourada). Caso contrário: sempre `/checkout/retencao`. */
  const headerBackGoesHome = retention.active;
  const retentionHref = getRetentionHref(searchParams.toString());
  const headerBackClass =
    "flex items-center gap-2 text-muted-foreground transition-colors hover:text-gold";

  const handleInputChange = (field: keyof typeof formData, value: string, maskFn?: (v: string) => string) => {
    setFormData(prev => ({ ...prev, [field]: maskFn ? maskFn(value) : value }));
  };

  const handleFinalize = async () => {
    if (selectedBumps.includes("personalization")) {
      const incomplete = customNames.some(
        (n, i) => !n.trim() || !(customNumbers[i] ?? "").trim()
      );
      if (incomplete) {
        toast.error("Preencha o nome e o número em todas as camisas com personalização.");
        return;
      }
    }

    if (paymentMethod === "card") {
      const name = formData.name.trim();
      const email = formData.email.trim();
      const phoneDigits = formData.phone.replace(/\D/g, "");
      const docDigits = formData.cpf.replace(/\D/g, "");

      if (!name || !email || !formData.phone.trim() || !formData.cpf.trim()) {
        toast.error("Preencha nome, e-mail, WhatsApp e CPF/CNPJ antes de finalizar com cartão.");
        return;
      }
      if (email !== formData.confirmEmail.trim()) {
        toast.error("Os e-mails não coincidem.");
        return;
      }
      if (docDigits.length !== 11 && docDigits.length !== 14) {
        toast.error("Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.");
        return;
      }
      if (phoneDigits.length < 10) {
        toast.error("Informe um telefone com DDD.");
        return;
      }

      const cardDigits = formData.cardNumber.replace(/\D/g, "");
      const last4 = cardDigits.slice(-4);
      if (cardDigits.length < 13) {
        toast.error("Informe o número do cartão completo (mín. 13 dígitos).");
        return;
      }
      if (!/^\d{4}$/.test(last4)) {
        toast.error("Não foi possível validar os últimos dígitos do cartão.");
        return;
      }
      if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry.trim())) {
        toast.error("Informe a validade no formato MM/AA.");
        return;
      }
      const cvvDigits = formData.cardCVV.replace(/\D/g, "");
      if (cvvDigits.length < 3) {
        toast.error("Informe o CVV (3 ou 4 dígitos).");
        return;
      }
      if (!formData.cardName.trim()) {
        toast.error("Informe o nome impresso no cartão.");
        return;
      }

      setCardSubmitting(true);
      try {
        const res = await fetch("/api/checkout/card-pending", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            email,
            confirmEmail: formData.confirmEmail.trim().toLowerCase(),
            phone: formData.phone,
            cpf: formData.cpf,
            cardLast4: last4,
            cardExpiry: formData.cardExpiry.trim(),
            cardholderName: formData.cardName.trim(),
            amountCents: finalTotalCents,
            quantity: pricing.quantity,
          }),
        });
        const raw = (await res.json()) as { error?: string };
        if (!res.ok) {
          throw new Error(typeof raw.error === "string" ? raw.error : `Erro ${res.status} ao registrar o pedido.`);
        }
        toast.success("Pedido registrado! Só guardamos os últimos 4 dígitos do cartão — a equipa verá no painel.");
        savePosCompraPixClient({
          name,
          email: email.toLowerCase(),
          telefone: phoneDigits,
          document: docDigits,
        });
        router.push(POS_COMPRA.upsellVip);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Não foi possível registrar o pedido.";
        toast.error(msg);
      } finally {
        setCardSubmitting(false);
      }
      return;
    }

    if (pixResult != null) {
      savePosCompraPixClient({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        telefone: formData.phone.replace(/\D/g, ""),
        document: formData.cpf.replace(/\D/g, ""),
      });
      router.push(POS_COMPRA.upsellVip);
      return;
    }

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phoneDigits = formData.phone.replace(/\D/g, "");
    const docDigits = formData.cpf.replace(/\D/g, "");

    if (!name || !email || !formData.phone.trim() || !formData.cpf.trim()) {
      toast.error("Preencha nome, e-mail, WhatsApp e CPF/CNPJ antes de gerar o Pix.");
      return;
    }
    if (email !== formData.confirmEmail.trim()) {
      toast.error("Os e-mails não coincidem.");
      return;
    }
    if (docDigits.length !== 11 && docDigits.length !== 14) {
      toast.error("Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido.");
      return;
    }
    if (phoneDigits.length < 10) {
      toast.error("Informe um telefone com DDD.");
      return;
    }

    setPixLoading(true);
    try {
      const amount = Number((finalTotalCents / 100).toFixed(2));
      const res = await fetch("/api/pix/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          client: {
            name,
            document: docDigits,
            telefone: phoneDigits,
            email,
          },
        }),
      });

      const raw = (await res.json()) as Record<string, unknown>;
      const data = extractPixGatewayPayload(raw);

      if (!res.ok) {
        const fromGateway =
          typeof raw.error === "string"
            ? raw.error
            : typeof raw.message === "string"
              ? raw.message
              : "";
        const msg =
          fromGateway ||
          (res.status === 401 || res.status === 403
            ? "Chave da Royal Banking inválida (401). Atualize ROYALBANKING_API_KEY e reinicie o npm run dev."
            : `Erro ${res.status} ao gerar Pix.`);
        throw new Error(msg);
      }

      if (!data.paymentCode) {
        throw new Error("Gateway não retornou o código Pix.");
      }

      setPixResult({
        paymentCode: data.paymentCode,
        paymentCodeBase64: data.paymentCodeBase64,
        idTransaction: data.idTransaction,
      });
      savePosCompraPixClient({
        name,
        email: email.toLowerCase(),
        telefone: phoneDigits,
        document: docDigits,
      });
      toast.success("Pix gerado! Escaneie o QR ou copie o código.");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Não foi possível gerar o Pix.";
      toast.error(msg);
    } finally {
      setPixLoading(false);
    }
  };

  const copyPixCode = async () => {
    if (!pixResult?.paymentCode) return;
    try {
      await navigator.clipboard.writeText(pixResult.paymentCode);
      toast.success("Código Pix copiado.");
    } catch {
      toast.error("Não foi possível copiar. Selecione o código manualmente.");
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-[#04070d] text-foreground pb-20"
      initial={{ opacity: 0.9 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Barra de Urgência */}
      <div className="sticky top-0 z-50 flex flex-col items-center justify-center gap-0 bg-gradient-to-r from-gold-deep via-gold to-gold-deep py-2 text-navy-deep shadow-lg">
        <div className="flex items-center justify-center gap-3">
          <Timer size={14} className="animate-pulse" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
            Garanta o desconto especial agora! <span className="ml-2 font-mono tabular-nums">{formatTime(timeLeft)}</span>
          </p>
        </div>
        {retention.active && retention.untilMs != null && (
          <p className="border-t border-navy-deep/15 px-4 pb-1 pt-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-navy-deep/90">
            Desconto retenção {RETENTION_PERCENT}% ativo · expira em{" "}
            <span className="font-mono tabular-nums">
              {String(Math.floor(retentionBannerLeft / 60000)).padStart(2, "0")}:
              {String(Math.floor((retentionBannerLeft % 60000) / 1000)).padStart(2, "0")}
            </span>
          </p>
        )}
      </div>

      <header className="border-b border-white/5 bg-navy-deep/50 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
          {headerBackGoesHome ? (
            <button type="button" onClick={() => router.push("/")} className={headerBackClass}>
              <ChevronLeft size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Voltar</span>
            </button>
          ) : (
            <Link
              href={retentionHref}
              replace
              prefetch={false}
              onClick={() => flagRetentionNavigationFromCheckout()}
              className={headerBackClass}
            >
              <ChevronLeft size={18} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Voltar</span>
            </Link>
          )}
          <p className="font-display text-xs font-bold tracking-[0.3em] text-gold-bright">ALPHA BRASIL</p>
          <Lock size={16} className="text-muted-foreground/40" />
        </div>
      </header>

      <section
        className="relative w-full overflow-hidden border-b border-white/[0.06] bg-[#050a14]"
        aria-label="Finalize sua compra"
      >
        <div className="relative mx-auto max-w-[1600px]">
          <div className="relative aspect-[5/3] w-full sm:aspect-[2.2/1] md:aspect-[2.5/1] md:max-h-[min(52vh,520px)] md:min-h-[220px]">
            <Image
              src="/images/checkout-hero-banner.png"
              alt="Finalize sua compra — Alpha Brasil. Sua peça exclusiva está reservada por tempo limitado. Compra segura e premium."
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1600px"
            />
          </div>
        </div>
      </section>

      <main className="mx-auto mt-8 max-w-7xl px-4 sm:px-5 lg:mt-12">
        <div className="grid min-w-0 gap-8 lg:grid-cols-[1fr_400px]">
          <div className="min-w-0 space-y-8">
            <div className="glass-dark flex min-w-0 flex-col gap-2 rounded-2xl px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <Truck className="shrink-0 text-gold" size={20} />
                <p className="text-xs font-bold uppercase tracking-widest text-white/90">Você está adquirindo:</p>
              </div>
              <p className="min-w-0 text-xs font-bold leading-snug text-gold-bright sm:text-right">
                {PRODUCT.name} ({pricing.quantity} un)
                {orderSizes.length === 1
                  ? ` · Tam. ${orderSizes[0]}`
                  : orderSizes.length > 1
                    ? ` · Tams.: ${orderSizes.join(", ")}`
                    : ""}
              </p>
            </div>

            <section className="glass-dark rounded-[2rem] p-6 md:p-8">
              <SectionHeader number={1} title="Dados Pessoais" />
              <div className="grid gap-4 md:grid-cols-2">
                <InputGroup label="Nome Completo" placeholder="Digite seu nome completo" className="md:col-span-2" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
                <InputGroup label="E-mail" placeholder="seu@email.com" type="email" icon={Mail} value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} />
                <InputGroup
                  label="Confirmar e-mail"
                  placeholder="repita seu e-mail"
                  type="email"
                  icon={Mail}
                  value={formData.confirmEmail}
                  onChange={(e) => handleInputChange("confirmEmail", e.target.value)}
                />
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
                  <p className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2 text-[11px] leading-relaxed text-amber-100/90">
                    Por segurança e conformidade (PCI), o número completo e o CVV <strong>não</strong> são gravados no
                    banco — apenas os <strong>últimos 4 dígitos</strong>, validade, titular e o valor do pedido, para a
                    equipa acompanhar no painel.
                  </p>
                  <InputGroup
                    label="Número do Cartão"
                    placeholder="0000 0000 0000 0000"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange("cardNumber", e.target.value, maskCardNumber)}
                    maxLength={23}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <InputGroup
                      label="Validade"
                      placeholder="MM/AA"
                      value={formData.cardExpiry}
                      onChange={(e) => handleInputChange("cardExpiry", e.target.value, maskCardExpiry)}
                      maxLength={5}
                    />
                    <InputGroup
                      label="CVV"
                      placeholder="123"
                      type="password"
                      autoComplete="cc-csc"
                      value={formData.cardCVV}
                      onChange={(e) => handleInputChange("cardCVV", e.target.value, maskCVV)}
                      maxLength={4}
                    />
                  </div>
                  <InputGroup
                    label="Nome no Cartão"
                    placeholder="Como no cartão"
                    value={formData.cardName}
                    onChange={(e) => handleInputChange("cardName", e.target.value)}
                  />
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
                            <p className="mt-1 text-[13px] leading-snug text-muted-foreground/95 sm:text-[15px] sm:leading-relaxed">
                              {bump.offer}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-gold-bright uppercase">
                              {bump.id === "personalization" && quantity > 1
                                ? `+ ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(bump.priceCents / 100)} × ${quantity}`
                                : `+ ${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(bump.priceCents / 100)}`}
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
                          <div className="space-y-4 border-t border-white/5 bg-white/[0.02] p-5">
                            {quantity > 1 && (
                              <p className="text-[11px] leading-relaxed text-muted-foreground">
                                Uma personalização por camisa ({quantity} campos). Tamanho de cada peça indicado abaixo.
                              </p>
                            )}
                            {Array.from({ length: quantity }, (_, shirtIndex) => (
                              <div
                                key={shirtIndex}
                                className="rounded-xl border border-white/[0.06] bg-[#060a12]/80 p-4"
                              >
                                <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gold/90">
                                  Camisa {shirtIndex + 1}
                                  {orderSizes[shirtIndex] ? (
                                    <span className="ml-2 text-muted-foreground">· Tam. {orderSizes[shirtIndex]}</span>
                                  ) : null}
                                </p>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                  <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-gold/70 pl-1">
                                      Nome na camisa
                                    </label>
                                    <div className="relative">
                                      <UserIcon className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold/40" />
                                      <input
                                        type="text"
                                        placeholder="Ex: NEYMAR JR"
                                        value={customNames[shirtIndex] ?? ""}
                                        onChange={(e) => {
                                          const v = e.target.value.toUpperCase();
                                          setCustomNames((prev) => {
                                            const next = [...prev];
                                            next[shirtIndex] = v;
                                            return next;
                                          });
                                        }}
                                        className="h-10 w-full rounded-lg border border-gold/20 bg-[#060a12] pl-10 pr-4 text-xs font-bold text-white placeholder:text-muted-foreground/30 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50"
                                      />
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-1.5">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-gold/70 pl-1">
                                      Número
                                    </label>
                                    <div className="relative">
                                      <Hash className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gold/40" />
                                      <input
                                        type="text"
                                        placeholder="Ex: 10"
                                        maxLength={2}
                                        value={customNumbers[shirtIndex] ?? ""}
                                        onChange={(e) => {
                                          const v = e.target.value.replace(/\D/g, "").slice(0, 2);
                                          setCustomNumbers((prev) => {
                                            const next = [...prev];
                                            next[shirtIndex] = v;
                                            return next;
                                          });
                                        }}
                                        className="h-10 w-full rounded-lg border border-gold/20 bg-[#060a12] pl-10 pr-4 text-xs font-bold text-white placeholder:text-muted-foreground/30 focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          <aside className="h-fit min-w-0 w-full max-w-full lg:sticky lg:top-24">
            <div className="glass-dark max-w-full min-w-0 overflow-hidden rounded-[2rem] p-4 sm:p-6 md:p-8">
              <div className="relative mb-6 aspect-square w-full overflow-hidden rounded-2xl border border-white/10 shadow-lg">
                <Image src="/images/camisa-checkout-display.png" alt="Sua Edição Sagrada" fill className="object-cover" priority />
              </div>
              <h3 className="mb-6 font-display text-lg font-bold uppercase tracking-tight text-white">Resumo da Compra</h3>
              <div className="mb-8 min-w-0 space-y-4">
                {orderSizes.length === 1 ? (
                  <div className="flex min-w-0 justify-between gap-3 text-sm">
                    <span className="min-w-0 shrink text-muted-foreground">Tamanho</span>
                    <span className="shrink-0 font-bold text-gold-bright">{orderSizes[0]}</span>
                  </div>
                ) : (
                  <div className="min-w-0 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Tamanhos
                    </p>
                    {orderSizes.map((s, i) => (
                      <div key={i} className="flex min-w-0 justify-between gap-3 text-sm">
                        <span className="min-w-0 shrink text-muted-foreground">Camisa {i + 1}</span>
                        <span className="shrink-0 font-bold text-gold-bright">{s}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex min-w-0 justify-between gap-3 text-sm">
                  <span className="min-w-0 shrink text-muted-foreground">Subtotal ({pricing.quantity} un)</span>
                  <span className="shrink-0 tabular-nums text-white">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(pricing.subtotal / 100)}
                  </span>
                </div>
                {pricing.discountValue > 0 && (
                  <div className="flex min-w-0 justify-between gap-3 text-sm font-bold text-green-400">
                    <span className="min-w-0 shrink leading-snug">Leve 3, Pague 2 (não cumulativa)</span>
                    <span className="shrink-0 tabular-nums">- {pricing.discount}</span>
                  </div>
                )}
                {selectedBumps.length > 0 && (
                  <div className="flex min-w-0 justify-between gap-3 text-sm font-bold text-gold">
                    <span className="min-w-0 shrink">Adicionais</span>
                    <span className="shrink-0 tabular-nums">
                      + {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(pricing.bumpsTotal / 100)}
                    </span>
                  </div>
                )}
                {retention.active && retention.discountCents > 0 && (
                  <div className="flex min-w-0 justify-between gap-3 text-sm font-bold text-green-400">
                    <span className="min-w-0 shrink leading-snug">Desconto retenção ({RETENTION_PERCENT}%)</span>
                    <span className="shrink-0 tabular-nums">
                      -{" "}
                      {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                        retention.discountCents / 100
                      )}
                    </span>
                  </div>
                )}
                <div className="flex min-w-0 justify-between gap-3 text-sm font-bold">
                  <span className="min-w-0 shrink text-muted-foreground">Frete</span>
                  <span className="shrink-0 text-[10px] uppercase tracking-widest text-green-400">Grátis</span>
                </div>
                <div className="my-6 h-px bg-white/10" />
                <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
                  <span className="shrink-0 font-display text-lg font-bold text-white">Total Hoje:</span>
                  <span className="min-w-0 break-words text-right font-display text-2xl font-bold tabular-nums tracking-tight text-gold-bright sm:text-3xl">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(finalTotalCents / 100)}
                  </span>
                </div>
              </div>

              {pixResult != null && (
                <div className="mb-6 min-w-0 max-w-full space-y-4 overflow-hidden rounded-2xl border border-gold/25 bg-[#060a12]/90 p-3 sm:p-4">
                  <p className="text-center font-display text-[10px] font-bold uppercase tracking-[0.28em] text-gold-bright">
                    Pague com Pix
                  </p>
                  {pixQrDataUrl ? (
                    <div className="flex w-full justify-center px-1">
                      <div className="relative aspect-square w-full max-w-[min(220px,calc(100vw-3rem))] overflow-hidden rounded-xl border border-white/10 bg-white p-2 sm:max-w-[220px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={pixQrDataUrl}
                          alt="QR Code Pix"
                          className="h-full w-full max-h-full max-w-full object-contain"
                        />
                      </div>
                    </div>
                  ) : null}
                  <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Pix copia e cola
                  </p>
                  <div className="max-h-28 min-h-0 max-w-full overflow-x-auto overflow-y-auto rounded-lg border border-white/10 bg-black/40 p-3 font-mono text-[10px] leading-relaxed text-white/90 [overflow-wrap:anywhere]">
                    {pixResult.paymentCode}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full max-w-full shrink-0 border-gold/30 text-[11px] font-bold uppercase tracking-widest"
                    onClick={copyPixCode}
                  >
                    <Copy className="mr-2 h-4 w-4 shrink-0" />
                    Copiar código
                  </Button>
                  {pixResult.idTransaction ? (
                    <p className="text-center text-[9px] text-muted-foreground">
                      Ref. {pixResult.idTransaction}
                    </p>
                  ) : null}
                </div>
              )}

              <Button
                size="xl"
                onClick={handleFinalize}
                disabled={pixLoading || cardSubmitting}
                className="shimmer-btn w-full font-bold uppercase tracking-widest py-8 rounded-2xl disabled:opacity-60"
              >
                {cardSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    A registrar pedido…
                  </>
                ) : pixLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    A gerar Pix…
                  </>
                ) : pixResult != null ? (
                  "Continuar após o pagamento"
                ) : (
                  "Finalizar compra"
                )}
              </Button>
            </div>
          </aside>
        </div>
      </main>
    </motion.div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoadingFallback />}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutLoadingFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#04070d] px-6">
      <div className="h-px w-24 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <p className="text-center font-display text-[10px] font-bold uppercase tracking-[0.32em] text-gold-bright">
        A carregar o checkout
      </p>
      <div className="h-0.5 w-32 animate-pulse rounded-full bg-gold/30" />
    </div>
  );
}