"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionReveal, SectionShell } from "@/components/landing/section-shell";
import { SECTION_STAGGER } from "@/hooks/use-section-motion";

const faqs = [
  {
    q: "Qual é a modelagem?",
    a: "Corte esportivo contemporâneo: ombros alinhados e torso com leve afunilamento. Não é slim extremo — equilíbrio entre presença e liberdade de movimento.",
  },
  {
    q: "O tecido é confortável?",
    a: "Sim. Mistura pensada para toque macio, respirabilidade e uso prolongado sem abrir mão da estrutura visual da peça.",
  },
  {
    q: "O produto tem boa durabilidade?",
    a: "Costura reforçada e matéria-prima selecionada para manter cor e forma após lavagens corretas. Siga sempre a etiqueta.",
  },
  {
    q: "Como funciona o envio?",
    a: "Preparamos seu pedido com agilidade e envio rastreado. Prazos e regiões são calculados diretamente no checkout.",
  },
  {
    q: "Posso pagar com Pix?",
    a: "Sim — a experiência de compra é totalmente integrada ao Pix. O QR Code é gerado instantaneamente no checkout e a confirmação do seu pedido ocorre em poucos segundos após o pagamento.",
  },
  {
    q: "Como funciona a troca?",
    a: "Política de troca alinhada ao CDC. Oferecemos a primeira troca grátis em até 7 dias após o recebimento, garantindo sua total satisfação.",
  },
];

export function FaqSection() {
  return (
    <SectionShell
      id="duvidas"
      aria-labelledby="faq-heading"
      variant="default"
      grain="low"
      contentClassName="max-w-3xl !px-5 md:!px-10 md:pb-36 md:pt-28"
      className="scroll-mt-24"
    >
      <SectionReveal className="text-center">
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-gold/75">
          Suporte
        </p>
        <h2
          id="faq-heading"
          className="mt-4 font-display text-[clamp(2.25rem,4vw,3rem)] font-bold leading-tight tracking-tight"
        >
          Perguntas{" "}
          <span className="bg-gradient-to-r from-gold-bright to-gold-muted bg-clip-text text-transparent">
            frequentes
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-lg leading-relaxed text-muted-foreground">
          Transparência para decidir com segurança — sem ruído.
        </p>
      </SectionReveal>

      <Accordion type="single" collapsible className="mt-14 w-full space-y-2">
        {faqs.map((item, i) => (
          <motion.div
            key={item.q}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              delay: i * SECTION_STAGGER,
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <AccordionItem
              value={`item-${i}`}
              className="!border-none overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.015] px-1 shadow-luxe transition-[box-shadow,border,background-color] duration-300 hover:border-white/[0.1] hover:bg-white/[0.03] hover:shadow-luxe-hover data-[state=open]:border-gold/25 data-[state=open]:bg-white/[0.04] data-[state=open]:shadow-luxe-hover"
            >
              <AccordionTrigger className="px-4 text-left font-display text-[15px] font-semibold leading-snug md:text-base">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="!pb-6 px-4 text-[15px]">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </SectionShell>
  );
}