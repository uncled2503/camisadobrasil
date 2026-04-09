"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useVideoBoomerangLoop } from "@/hooks/use-video-boomerang-loop";
import { GALLERY_IMAGES } from "@/lib/product";
import { SectionReveal, SectionShell } from "@/components/landing/section-shell";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Maximize2 } from "lucide-react";

type GalleryItem = (typeof GALLERY_IMAGES)[number];

function isGalleryVideo(item: GalleryItem): item is Extract<
  GalleryItem,
  { kind: "video" }
> {
  return "kind" in item && item.kind === "video";
}

function galleryThumbSrc(item: GalleryItem): string {
  return isGalleryVideo(item) ? item.posterSrc : item.src;
}

export function PremiumGallery() {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const lightboxVideoRef = useRef<HTMLVideoElement | null>(null);

  const activeItem = GALLERY_IMAGES[active];
  const galleryVideoActive = isGalleryVideo(activeItem);

  useVideoBoomerangLoop({
    videoRef,
    active: galleryVideoActive,
    useNativeLoop: !!reduced,
    restartKey: galleryVideoActive ? active : `off-${active}`,
  });

  useEffect(() => {
    if (!galleryVideoActive || !reduced) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    void v.play().catch(() => {});
  }, [galleryVideoActive, reduced, active]);

  useEffect(() => {
    if (!lightboxOpen || !isGalleryVideo(activeItem)) return;
    const v = lightboxVideoRef.current;
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p !== undefined) p.catch(() => {});
  }, [lightboxOpen, activeItem]);

  return (
    <SectionShell
      id="galeria"
      aria-labelledby="gallery-heading"
      variant="highlight"
      grain="low"
      className="scroll-mt-24"
      backgroundSlot={
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,hsl(38_25%_12%/0.18),transparent)]" />
      }
    >
      <SectionReveal className="mb-14 flex max-w-3xl flex-col gap-5 md:mb-20">
        <p className="font-display text-[10px] font-semibold uppercase tracking-[0.42em] text-gold/75">
          Campanha visual
        </p>
        <h2
          id="gallery-heading"
          className="font-display text-[clamp(2.25rem,4vw,3rem)] font-bold leading-[1.05] tracking-tight text-balance"
        >
          Galeria{" "}
          <span className="bg-gradient-to-r from-gold-bright to-gold-muted bg-clip-text text-transparent">
            premium
          </span>
        </h2>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
          Detalhes que contam a história da peça — toque, caimento e presença em cada enquadramento.
        </p>
      </SectionReveal>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
        <motion.div
          layout
          className="relative min-h-[56vh] flex-1 overflow-hidden rounded-[1.75rem] shadow-luxe transition-shadow duration-500 hover:shadow-luxe-hover md:min-h-[62vh] md:rounded-[2rem] lg:aspect-auto"
        >
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#04070d]/45 via-transparent to-white/[0.02]" />
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              {isGalleryVideo(activeItem) ? (
                <video
                  ref={videoRef}
                  key={activeItem.webmSrc}
                  className="h-full w-full object-cover object-center"
                  muted
                  loop={!!reduced}
                  playsInline
                  autoPlay={!!reduced}
                  preload="auto"
                  poster={activeItem.posterSrc}
                  aria-label={activeItem.alt}
                >
                  <source src={activeItem.webmSrc} type="video/webm" />
                  <source src={activeItem.mp4Src} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={activeItem.src}
                  alt={activeItem.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 72vw"
                  priority={active === 0}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="absolute bottom-6 right-6 z-20 flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-black/45 px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white/90 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:border-gold/35 hover:bg-black/55 hover:shadow-[0_0_32px_-8px_rgba(196,169,122,0.25)]"
          >
            <Maximize2 className="h-3.5 w-3.5 text-gold/90" aria-hidden />
            Ampliar
          </button>
        </motion.div>

        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent
            className={cn(
              "flex max-h-[min(92dvh,980px)] w-[min(calc(100vw-1.25rem),1280px)] max-w-none flex-col gap-0 overflow-hidden border border-white/[0.1] bg-[#05080f]/97 p-2 shadow-luxe backdrop-blur-2xl sm:p-3 md:p-4",
              "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl sm:rounded-[1.35rem]"
            )}
          >
            <DialogTitle className="sr-only">{activeItem.alt}</DialogTitle>
            <DialogDescription className="sr-only">
              Visualização ampliada para ver textura e detalhes da peça.
            </DialogDescription>
            <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
              {isGalleryVideo(activeItem) ? (
                <video
                  ref={lightboxVideoRef}
                  key={`lb-${active}-${activeItem.webmSrc}`}
                  className="mx-auto max-h-[min(82dvh,860px)] w-full max-w-full object-contain object-center"
                  muted
                  loop
                  playsInline
                  autoPlay
                  preload="auto"
                  poster={activeItem.posterSrc}
                  controls
                  aria-label={activeItem.alt}
                >
                  <source src={activeItem.webmSrc} type="video/webm" />
                  <source src={activeItem.mp4Src} type="video/mp4" />
                </video>
              ) : (
                <div className="relative mx-auto h-[min(82dvh,860px)] w-full max-w-full">
                  <Image
                    src={activeItem.src}
                    alt={activeItem.alt}
                    fill
                    className="object-contain object-center"
                    sizes="(max-width: 1280px) 96vw, 1200px"
                  />
                </div>
              )}
            </div>
            <p className="mt-2 px-1 text-center text-[10px] uppercase tracking-[0.28em] text-muted-foreground sm:mt-3">
              Esc · clique fora ou ✕ para fechar
            </p>
          </DialogContent>
        </Dialog>

        <div
          className="flex gap-3 overflow-x-auto pb-1 lg:w-[112px] lg:flex-shrink-0 lg:flex-col lg:overflow-visible lg:pb-0"
          style={{ scrollbarWidth: "thin" }}
        >
          {GALLERY_IMAGES.map((img, i) => (
            <button
              key={`${galleryThumbSrc(img)}-${i}`}
              type="button"
              onClick={() => {
                setActive(i);
                setLightboxOpen(false);
              }}
              className={cn(
                "relative h-[4.5rem] w-[4.5rem] shrink-0 overflow-hidden rounded-xl transition-all duration-300 md:h-24 md:w-24 lg:h-[5.25rem] lg:w-full",
                active === i
                  ? "ring-2 ring-gold/70 ring-offset-2 ring-offset-[#07111f] shadow-gold-soft"
                  : "opacity-60 ring-1 ring-white/[0.06] hover:scale-[1.03] hover:opacity-100 hover:ring-white/15"
              )}
            >
              <Image
                src={galleryThumbSrc(img)}
                alt=""
                fill
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      </div>

      <p className="mt-8 text-center text-[10px] uppercase tracking-[0.35em] text-muted-foreground lg:text-left">
        Selecione uma miniatura · transição suave
      </p>
    </SectionShell>
  );
}