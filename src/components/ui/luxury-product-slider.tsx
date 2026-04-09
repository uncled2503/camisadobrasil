"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useVideoBoomerangLoop } from "@/hooks/use-video-boomerang-loop";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type LuxuryProductSlide = {
  src: string;
  alt: string;
  media?: "image" | "video";
  paginationLabel?: string;
  /** Poster enquanto o vídeo carrega (só slides `video`) */
  posterSrc?: string;
};

export type LuxuryProductSliderProps = {
  images: readonly LuxuryProductSlide[];
  sizes?: string;
  quality?: number;
  priority?: boolean;
  className?: string;
  viewportClassName?: string;
  aspectClassName?: string;
  "aria-label"?: string;
  index?: number;
  onIndexChange?: (index: number) => void;
  showPagination?: boolean;
  children?: ReactNode;
};

type ProductSliderContextValue = {
  index: number;
  goTo: (i: number) => void;
  viewportId: string;
  images: readonly LuxuryProductSlide[];
};

const ProductSliderContext = createContext<ProductSliderContextValue | null>(
  null
);

function slidePaginationLabel(
  img: LuxuryProductSlide,
  i: number,
  total: number
): string {
  if (img.paginationLabel) return img.paginationLabel;
  if (img.media === "video") return "Vídeo — rotação 360°";
  if (total === 2) return i === 0 ? "Vista frontal" : "Vista de costas";
  return `Vista ${i + 1}`;
}

export function ProductSliderDots({ className }: { className?: string }) {
  const ctx = useContext(ProductSliderContext);
  if (!ctx || ctx.images.length <= 1) return null;
  const { index, goTo, viewportId, images } = ctx;
  const n = images.length;
  return (
    <div
      className={cn("flex justify-center gap-2", className)}
      role="group"
      aria-label="Selecionar vista do produto"
    >
      {images.map((img, i) => (
        <button
          key={`${img.src}-${i}`}
          type="button"
          aria-current={i === index ? "true" : undefined}
          aria-controls={viewportId}
          aria-label={slidePaginationLabel(img, i, n)}
          onClick={() => goTo(i)}
          className={cn(
            "h-1 rounded-full transition-all duration-300 ease-out",
            i === index
              ? "w-6 bg-[hsl(38,32%,58%)]"
              : "w-1.5 bg-white/20 hover:bg-white/35"
          )}
        />
      ))}
    </div>
  );
}

const SWIPE_THRESHOLD_PX = 36;
const SWIPE_VELOCITY_MIN = 380;
const SLIDE_X = 22;

function usePreloadImages(srcs: string[]) {
  useEffect(() => {
    for (const src of srcs) {
      const img = new window.Image();
      img.src = src;
    }
  }, [srcs]);
}

/** Um único vídeo em loop — sem arraste, sem setas (modo teste / vitrine). */
function LuxuryProductSingleVideoLoop({
  images,
  className,
  viewportClassName,
  aspectClassName = "aspect-[812/1024]",
  "aria-label": ariaLabel = "Vídeo do produto",
  showPagination,
  children,
}: LuxuryProductSliderProps) {
  const id = useId();
  const reduced = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const slide = images[0]!;

  useVideoBoomerangLoop({
    videoRef,
    active: true,
    useNativeLoop: !!reduced,
    restartKey: slide.src,
  });

  const ctxValue = useMemo<ProductSliderContextValue>(
    () => ({
      index: 0,
      goTo: () => {},
      viewportId: `${id}-viewport`,
      images,
    }),
    [id, images]
  );

  useEffect(() => {
    if (!reduced) return;
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    void v.play().catch(() => {});
  }, [reduced, slide.src]);

  return (
    <ProductSliderContext.Provider value={ctxValue}>
      <div className={cn("relative", className)}>
        <div
          role="region"
          aria-label={ariaLabel}
          className={cn("relative", viewportClassName)}
        >
          <div
            id={`${id}-viewport`}
            className={cn(
              "relative mx-auto w-full overflow-hidden",
              aspectClassName,
              "max-h-[min(78vh,820px)] max-w-[min(100%,820px)]"
            )}
          >
            <video
              ref={videoRef}
              src={slide.src}
              className="pointer-events-none absolute inset-0 h-full w-full object-contain object-center select-none"
              muted
              playsInline
              loop={!!reduced}
              autoPlay={!!reduced}
              preload="auto"
              poster={slide.posterSrc}
              aria-label={slide.alt}
            />
          </div>
        </div>

        {showPagination && images.length > 1 && (
          <ProductSliderDots className="mt-3 sm:mt-3.5" />
        )}

        {children}
      </div>
    </ProductSliderContext.Provider>
  );
}

function LuxuryProductSliderCarousel({
  images,
  sizes = "(max-width: 640px) 94vw, (max-width: 1024px) 88vw, min(600px, 42vw)",
  quality = 95,
  priority = false,
  className,
  viewportClassName,
  aspectClassName = "aspect-[812/1024]",
  "aria-label": ariaLabel = "Galeria do produto",
  index: controlledIndex,
  onIndexChange,
  showPagination = true,
  children,
}: LuxuryProductSliderProps) {
  const id = useId();
  const reduced = useReducedMotion();
  const [internalIndex, setInternalIndex] = useState(0);
  const isControlled =
    controlledIndex !== undefined && onIndexChange !== undefined;
  const index = isControlled ? controlledIndex! : internalIndex;
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const [videoMetaReady, setVideoMetaReady] = useState(false);
  const [pauseAutoRotate, setPauseAutoRotate] = useState(false);
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const autoRotateRaf = useRef<number | null>(null);
  const pointerDownAtRef = useRef(0);
  const tapXRef = useRef(0);
  const videoScrubBaseRef = useRef(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  const count = images.length;
  const imageSrcs = useMemo(
    () => images.filter((i) => i.media !== "video").map((i) => i.src),
    [images]
  );
  usePreloadImages(imageSrcs);

  const videoPoster = useMemo(() => {
    const v = images.find((s) => s.media === "video");
    if (v?.posterSrc) return v.posterSrc;
    return images.find((s) => s.media !== "video")?.src;
  }, [images]);

  const scheduleResumeAuto = useCallback(() => {
    setPauseAutoRotate(true);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    pauseTimerRef.current = setTimeout(() => {
      setPauseAutoRotate(false);
      pauseTimerRef.current = null;
    }, 4200);
  }, []);

  useEffect(() => {
    return () => {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      if (autoRotateRaf.current) cancelAnimationFrame(autoRotateRaf.current);
    };
  }, []);

  const isVideoAt = useCallback(
    (i: number) => images[i]?.media === "video",
    [images]
  );

  useEffect(() => {
    if (!isVideoAt(index)) {
      setVideoMetaReady(false);
    }
  }, [index, isVideoAt]);

  const goTo = useCallback(
    (i: number) => {
      if (i === index) return;
      setDirection(i > index ? 1 : -1);
      if (isControlled) {
        onIndexChange!(i);
      } else {
        setInternalIndex(i);
      }
    },
    [index, isControlled, onIndexChange]
  );

  const go = useCallback(
    (delta: number) => {
      if (count <= 1) return;
      setDirection(delta);
      const next = (index + delta + count) % count;
      if (isControlled) {
        onIndexChange!(next);
      } else {
        setInternalIndex(next);
      }
    },
    [count, isControlled, index, onIndexChange]
  );

  const scrubVideo = useCallback(
    (dir: -1 | 1) => {
      const v = videoRef.current;
      if (!v || !Number.isFinite(v.duration) || v.duration <= 0) return;
      scheduleResumeAuto();
      const step = Math.max(0.05, v.duration / 52);
      const next = v.currentTime + dir * step;
      v.currentTime = Math.min(
        Math.max(0, next),
        Math.max(0, v.duration - 0.025)
      );
    },
    [scheduleResumeAuto]
  );

  const handleArrowNav = useCallback(
    (dir: -1 | 1) => {
      if (isVideoAt(index)) {
        scrubVideo(dir);
      } else if (count > 1) {
        go(dir);
      }
    },
    [isVideoAt, index, scrubVideo, count, go]
  );

  const goNext = useCallback(() => handleArrowNav(1), [handleArrowNav]);
  const goPrev = useCallback(() => handleArrowNav(-1), [handleArrowNav]);

  const ctxValue = useMemo<ProductSliderContextValue>(
    () => ({
      index,
      goTo,
      viewportId: `${id}-viewport`,
      images,
    }),
    [index, goTo, id, images]
  );

  const keyboardHot = hovered || focusWithin;

  useEffect(() => {
    if (!keyboardHot) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [keyboardHot, goNext, goPrev]);

  const applyVideoScrubFromOffset = useCallback(
    (offsetX: number, width: number) => {
      const v = videoRef.current;
      if (!v || !Number.isFinite(v.duration) || v.duration <= 0) return;
      const w = Math.max(width, 1);
      const delta = (-offsetX / w) * v.duration * 0.55;
      const base = videoScrubBaseRef.current;
      v.currentTime = Math.min(
        Math.max(0, base + delta),
        Math.max(0, v.duration - 0.025)
      );
    },
    []
  );

  const onDragStart = useCallback(() => {
    if (isVideoAt(index)) {
      const v = videoRef.current;
      videoScrubBaseRef.current =
        v && Number.isFinite(v.currentTime) ? v.currentTime : 0;
      scheduleResumeAuto();
    }
  }, [isVideoAt, index, scheduleResumeAuto]);

  const onViewportPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (e.button !== 0) return;
      pointerDownAtRef.current = performance.now();
      const el = viewportRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        tapXRef.current = e.clientX - r.left;
      }
    },
    []
  );

  const onDrag = useCallback(
    (_: unknown, info: { offset: { x: number } }) => {
      if (!isVideoAt(index)) return;
      const w = containerRef.current?.clientWidth ?? 360;
      applyVideoScrubFromOffset(info.offset.x, w);
    },
    [isVideoAt, index, applyVideoScrubFromOffset]
  );

  const onDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      if (isVideoAt(index)) {
        const v = videoRef.current;
        if (v && Number.isFinite(v.duration) && v.duration > 0) {
          scheduleResumeAuto();
          const w = containerRef.current?.clientWidth ?? 360;
          applyVideoScrubFromOffset(info.offset.x, w);
        }
        return;
      }

      const elapsed = performance.now() - pointerDownAtRef.current;
      const vx = info.velocity.x;
      const x = info.offset.x;

      const fastFlick =
        Math.abs(vx) > SWIPE_VELOCITY_MIN && Math.abs(x) > 10;
      const passedThreshold = Math.abs(x) > SWIPE_THRESHOLD_PX;

      if (fastFlick || passedThreshold) {
        if (x < 0) go(1);
        else go(-1);
        return;
      }

      if (elapsed < 320 && Math.abs(x) < 16) {
        const w = viewportRef.current?.clientWidth ?? 360;
        const tapX = tapXRef.current;
        if (tapX < w * 0.36) go(-1);
        else if (tapX > w * 0.64) go(1);
      }
    },
    [isVideoAt, index, scheduleResumeAuto, applyVideoScrubFromOffset, go]
  );

  useEffect(() => {
    if (autoRotateRaf.current) {
      cancelAnimationFrame(autoRotateRaf.current);
      autoRotateRaf.current = null;
    }
    if (reduced || pauseAutoRotate || !isVideoAt(index) || !videoMetaReady) {
      return;
    }
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration) || v.duration <= 0.1) return;

    const dur = v.duration - 0.05;
    const t0 = performance.now();
    const periodMs = 9000;

    const tick = (now: number) => {
      const el = videoRef.current;
      if (!el || pauseAutoRotate || !isVideoAt(index)) return;
      const t = ((now - t0) % periodMs) / periodMs;
      const phase = (Math.sin(t * Math.PI * 2) + 1) / 2;
      el.currentTime = phase * dur;
      autoRotateRaf.current = requestAnimationFrame(tick);
    };
    autoRotateRaf.current = requestAnimationFrame(tick);
    return () => {
      if (autoRotateRaf.current) {
        cancelAnimationFrame(autoRotateRaf.current);
        autoRotateRaf.current = null;
      }
    };
  }, [reduced, pauseAutoRotate, isVideoAt, index, videoMetaReady]);

  const variants = useMemo(
    () =>
      reduced
        ? {
            enter: { opacity: 0 },
            center: { opacity: 1 },
            exit: { opacity: 0 },
          }
        : {
            enter: (dir: number) => ({
              x: dir > 0 ? SLIDE_X : -SLIDE_X,
              opacity: 0,
            }),
            center: { x: 0, opacity: 1 },
            exit: (dir: number) => ({
              x: dir > 0 ? -SLIDE_X : SLIDE_X,
              opacity: 0,
            }),
          },
    [reduced]
  );

  if (count === 0) return null;

  const current = images[index]!;
  const currentIsVideo = current.media === "video";
  const firstImageIndex = images.findIndex((s) => s.media !== "video");
  const chevronPrevLabel = currentIsVideo
    ? "Girar camisa — sentido anti-horário"
    : "Imagem anterior";
  const chevronNextLabel = currentIsVideo
    ? "Girar camisa — sentido horário"
    : "Próxima imagem";

  return (
    <ProductSliderContext.Provider value={ctxValue}>
      <div
        ref={containerRef}
        className={cn("group relative", className)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocusWithin(true)}
        onBlurCapture={(e) => {
          if (!containerRef.current?.contains(e.relatedTarget as Node | null)) {
            setFocusWithin(false);
          }
        }}
      >
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label={ariaLabel}
          aria-live="polite"
          tabIndex={0}
          id={`${id}-region`}
          className={cn("relative outline-none", viewportClassName)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              goPrev();
            } else if (e.key === "ArrowRight") {
              e.preventDefault();
              goNext();
            }
          }}
        >
          <div
            id={`${id}-viewport`}
            ref={viewportRef}
            className={cn(
              "relative mx-auto w-full overflow-hidden",
              aspectClassName,
              "max-h-[min(78vh,820px)] max-w-[min(100%,820px)]"
            )}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={index}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: reduced ? 0.2 : 0.42,
                  ease: [0.22, 1, 0.36, 1],
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.22}
                dragMomentum={false}
                onDragStart={onDragStart}
                onDrag={onDrag}
                onDragEnd={onDragEnd}
                onPointerDownCapture={onViewportPointerDown}
                className={cn(
                  "absolute inset-0 touch-none select-none",
                  currentIsVideo
                    ? "cursor-ew-resize active:cursor-grabbing"
                    : "cursor-grab active:cursor-grabbing"
                )}
              >
                {currentIsVideo ? (
                  <video
                    ref={videoRef}
                    src={current.src}
                    className="pointer-events-none absolute inset-0 h-full w-full object-contain object-center"
                    muted
                    playsInline
                    preload="auto"
                    poster={videoPoster}
                    aria-label={current.alt}
                    onLoadedMetadata={() => setVideoMetaReady(true)}
                  />
                ) : (
                  <Image
                    src={current.src}
                    alt={current.alt}
                    fill
                    priority={priority && index === firstImageIndex}
                    quality={quality}
                    sizes={sizes}
                    draggable={false}
                    className="object-contain object-center select-none"
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                aria-controls={`${id}-viewport`}
                aria-label={chevronPrevLabel}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  goPrev();
                }}
                className={cn(
                  "absolute left-1 top-1/2 z-[35] flex min-h-11 min-w-11 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full border border-white/20 bg-black/55 p-2.5 text-white shadow-[0_0_24px_-4px_rgba(212,175,55,0.25)] backdrop-blur-md transition-all duration-200",
                  "opacity-90 hover:border-gold/40 hover:bg-black/70 hover:text-gold-bright active:scale-95",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/40",
                  "sm:left-2 sm:min-h-12 sm:min-w-12 sm:p-3"
                )}
              >
                <ChevronLeft className="h-5 w-5 sm:h-[22px] sm:w-[22px]" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                aria-controls={`${id}-viewport`}
                aria-label={chevronNextLabel}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  goNext();
                }}
                className={cn(
                  "absolute right-1 top-1/2 z-[35] flex min-h-11 min-w-11 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full border border-white/20 bg-black/55 p-2.5 text-white shadow-[0_0_24px_-4px_rgba(212,175,55,0.25)] backdrop-blur-md transition-all duration-200",
                  "opacity-90 hover:border-gold/40 hover:bg-black/70 hover:text-gold-bright active:scale-95",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/40",
                  "sm:right-2 sm:min-h-12 sm:min-w-12 sm:p-3"
                )}
              >
                <ChevronRight className="h-5 w-5 sm:h-[22px] sm:w-[22px]" strokeWidth={1.5} />
              </button>
            </>
          )}
        </div>

        {showPagination && count > 1 && (
          <ProductSliderDots className="mt-3 sm:mt-3.5" />
        )}

        {children}
      </div>
    </ProductSliderContext.Provider>
  );
}

export function LuxuryProductSlider(props: LuxuryProductSliderProps) {
  const singleVideo =
    props.images.length === 1 && props.images[0]?.media === "video";
  if (singleVideo) {
    return <LuxuryProductSingleVideoLoop {...props} />;
  }
  return <LuxuryProductSliderCarousel {...props} />;
}
