"use client";

import { useCallback, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, ImagePlus, Loader2 } from "lucide-react";
import { SectionReveal, SectionShell } from "@/components/landing/section-shell";
import { Button } from "@/components/ui/button";

const MIN_MESSAGE = 15;
const MAX_FILE_BYTES = 5 * 1024 * 1024;

type SubmitState =
  | { status: "idle" }
  | { status: "submitting"; phase: "default" | "photo" }
  | { status: "error"; message: string }
  | { status: "success" };

export function FeedbackSection() {
  const formId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<SubmitState>({ status: "idle" });
  const [fileLabel, setFileLabel] = useState("Nenhuma foto");

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFileLabel(f ? f.name : "Nenhuma foto");
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const message = String(fd.get("message") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const photo = fileInputRef.current?.files?.[0];

    if (message.length < MIN_MESSAGE) {
      setState({
        status: "error",
        message: "Escreva pelo menos uma frase sobre a sua experiência.",
      });
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setState({
        status: "error",
        message: "E-mail inválido. Deixe em branco ou corrija.",
      });
      return;
    }

    if (photo) {
      if (!photo.type.startsWith("image/")) {
        setState({
          status: "error",
          message: "Escolha uma imagem (JPG, PNG ou WebP).",
        });
        return;
      }
      if (photo.size > MAX_FILE_BYTES) {
        setState({
          status: "error",
          message: "A foto deve ter no máximo 5 MB.",
        });
        return;
      }
    }

    setState({ status: "submitting", phase: "default" });
    await new Promise((r) => window.setTimeout(r, 420));

    if (photo) {
      setState({ status: "submitting", phase: "photo" });
      await new Promise((r) => window.setTimeout(r, 650));
    }

    form.reset();
    setFileLabel("Nenhuma foto");
    if (fileInputRef.current) fileInputRef.current.value = "";
    setState({ status: "success" });
  };

  return (
    <SectionShell
      id="feedback"
      aria-labelledby="feedback-heading"
      variant="highlight"
      grain="low"
      contentClassName="max-w-2xl !px-5 md:!px-10 md:pb-32 md:pt-24"
      className="scroll-mt-24"
    >
      <SectionReveal className="text-center">
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.4em] text-gold/75">
          Comunidade
        </p>
        <h2
          id="feedback-heading"
          className="mt-4 font-display text-[clamp(2rem,4vw,2.75rem)] font-bold leading-tight tracking-tight"
        >
          Envie{" "}
          <span className="bg-gradient-to-r from-gold-bright to-gold-muted bg-clip-text text-transparent">
            feedback
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-lg leading-relaxed text-muted-foreground">
          Partilhe o que achou da peça ou da experiência de compra.
        </p>
      </SectionReveal>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mt-12"
      >
        {state.status === "success" ? (
          <div className="overflow-hidden rounded-2xl border border-gold/25 bg-gradient-to-br from-white/[0.05] to-transparent p-8 text-center shadow-luxe md:p-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-bright">
              <CheckCircle2 className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <p className="mt-6 font-display text-lg font-semibold text-white md:text-xl">
              Feedback enviado
            </p>
            <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
              Obrigado pela sua mensagem. Pode fechar esta página quando quiser.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-8 border-gold/35"
              onClick={() => setState({ status: "idle" })}
            >
              Enviar outro feedback
            </Button>
          </div>
        ) : (
          <form
            id={formId}
            onSubmit={onSubmit}
            className="space-y-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 shadow-luxe md:p-8"
          >
            <div className="space-y-2 text-left">
              <label
                htmlFor={`${formId}-email`}
                className="block font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-gold/80"
              >
                E-mail{" "}
                <span className="font-sans normal-case tracking-normal text-muted-foreground">
                  (opcional)
                </span>
              </label>
              <input
                id={`${formId}-email`}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="opcional"
                className="w-full rounded-xl border border-white/[0.08] bg-black/25 px-4 py-3 text-sm text-foreground outline-none transition-[border,box-shadow] placeholder:text-muted-foreground/60 focus:border-gold/35 focus:ring-2 focus:ring-gold/20"
              />
            </div>

            <div className="space-y-2 text-left">
              <label
                htmlFor={`${formId}-message`}
                className="block font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-gold/80"
              >
                O seu feedback
              </label>
              <textarea
                id={`${formId}-message`}
                name="message"
                required
                minLength={MIN_MESSAGE}
                maxLength={4000}
                rows={6}
                placeholder="Como foi receber a camisa, qualidade, tamanho, embalagem…"
                className="w-full resize-y rounded-xl border border-white/[0.08] bg-black/25 px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition-[border,box-shadow] placeholder:text-muted-foreground/60 focus:border-gold/35 focus:ring-2 focus:ring-gold/20"
              />
            </div>

            <div className="space-y-2 text-left">
              <span className="block font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-gold/80">
                Foto do produto{" "}
                <span className="font-sans normal-case tracking-normal text-muted-foreground">
                  (opcional)
                </span>
              </span>
              <label
                htmlFor={`${formId}-photo`}
                className="flex cursor-pointer flex-col gap-3 rounded-xl border border-dashed border-white/[0.12] bg-black/20 px-4 py-5 transition-colors hover:border-gold/30 hover:bg-white/[0.02] md:flex-row md:items-center md:justify-between"
              >
                <span className="inline-flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-gold/90">
                    <ImagePlus className="h-5 w-5" strokeWidth={1.5} />
                  </span>
                  <span className="min-w-0 text-left">
                    <span className="block font-medium text-foreground">Adicionar foto</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      JPG, PNG ou WebP · até 5 MB
                    </span>
                  </span>
                </span>
                <span className="truncate text-xs text-gold/70 md:max-w-[12rem] md:text-right">
                  {fileLabel}
                </span>
              </label>
              <input
                ref={fileInputRef}
                id={`${formId}-photo`}
                type="file"
                accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                className="sr-only"
                onChange={onFileChange}
              />
            </div>

            {state.status === "error" && (
              <p className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200/95">
                {state.message}
              </p>
            )}

            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={state.status === "submitting"}
                className="min-w-[12rem] shrink-0 uppercase tracking-[0.12em]"
              >
                {state.status === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {state.phase === "photo" ? "A enviar foto…" : "A enviar…"}
                  </>
                ) : (
                  "Enviar feedback"
                )}
              </Button>
            </div>
          </form>
        )}
      </motion.div>
    </SectionShell>
  );
}
