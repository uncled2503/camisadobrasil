"use client";

import Image from "next/image";
import { useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useVideoBoomerangLoop } from "@/hooks/use-video-boomerang-loop";
import { cn } from "@/lib/utils";

type Slide = {
  src: string;
  alt: string;
  media: "image" | "video";
  posterSrc?: string;
};

type LuxuryProductSliderProps = {
  images: readonly Slide[];
  children?: React.ReactNode;
  className?: string;
  aspectClassName?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  "aria-label"?: string;
  showPagination?: boolean;
};

export function LuxuryProductSlider({
  images,
  children,
  className,
  aspectClassName = "aspect-[1/1]",
  priority = false,
  quality = 85,
  sizes,
  "aria-label": ariaLabel,
}: LuxuryProductSliderProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const reduced = useReducedMotion();
  // This simplified slider assumes one video slide, as used in the hero section.
  const currentSlide = images[0];
  const isVideo = currentSlide?.media === "video";

  useVideoBoomerangLoop({
    videoRef,
    active: isVideo,
    useNativeLoop: !!reduced,
    restartKey: isVideo ? currentSlide.src : "off",
  });

  if (!currentSlide) return null;

  return (
    <div className={cn("relative w-full", className)}>
      <div className={cn("relative w-full overflow-hidden", aspectClassName)}>
        {isVideo ? (
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            muted
            loop={!!reduced}
            playsInline
            autoPlay
            preload="auto"
            poster={currentSlide.posterSrc}
            aria-label={currentSlide.alt}
            controls={false}
          >
            <source src={currentSlide.src} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={currentSlide.src}
            alt={currentSlide.alt}
            fill
            className="object-cover"
            priority={priority}
            loading={priority ? undefined : "lazy"}
            quality={quality}
            sizes={sizes}
          />
        )}
      </div>
      {children}
    </div>
  );
}