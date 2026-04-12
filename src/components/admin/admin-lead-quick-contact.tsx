"use client";

import { Mail, MessageCircle, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { leadMailtoHref, leadTelHref, leadWhatsAppHref } from "@/lib/admin/lead-contact";

const btnClass =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.1] bg-white/[0.04] text-muted-foreground transition-colors hover:border-gold/25 hover:bg-gold/[0.08] hover:text-gold-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/30 disabled:pointer-events-none disabled:opacity-35";

type AdminLeadQuickContactProps = {
  phone: string;
  email: string;
  className?: string;
};

export function AdminLeadQuickContact({ phone, email, className }: AdminLeadQuickContactProps) {
  const wa = leadWhatsAppHref(phone);
  const tel = leadTelHref(phone);
  const mail = leadMailtoHref(email);

  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)} aria-label="Contato rápido">
      {wa ? (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className={btnClass}
          aria-label="Abrir WhatsApp"
          title="WhatsApp"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
        </a>
      ) : (
        <span className={cn(btnClass, "cursor-not-allowed")} aria-hidden title="Telefone inválido">
          <MessageCircle className="h-4 w-4 opacity-40" />
        </span>
      )}
      {mail ? (
        <a href={mail} className={btnClass} aria-label="Enviar e-mail" title="E-mail">
          <Mail className="h-4 w-4" aria-hidden />
        </a>
      ) : (
        <span className={cn(btnClass, "cursor-not-allowed")} aria-hidden title="E-mail inválido">
          <Mail className="h-4 w-4 opacity-40" />
        </span>
      )}
      {tel ? (
        <a href={tel} className={btnClass} aria-label="Ligar" title="Ligar">
          <Phone className="h-4 w-4" aria-hidden />
        </a>
      ) : (
        <span className={cn(btnClass, "cursor-not-allowed")} aria-hidden>
          <Phone className="h-4 w-4 opacity-40" />
        </span>
      )}
    </div>
  );
}
