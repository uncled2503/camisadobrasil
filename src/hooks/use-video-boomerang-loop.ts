"use client";

import { useEffect, type RefObject } from "react";

type UseVideoBoomerangLoopOptions = {
  videoRef: RefObject<HTMLVideoElement | null>;
  /** Se false, o efeito não corre (ex.: slide atual não é vídeo). */
  active: boolean;
  /** Com `prefers-reduced-motion`, usa `loop` + playback normal no elemento. */
  useNativeLoop: boolean;
  /** Reinicia o ciclo quando o media muda (ex. `src` do vídeo). */
  restartKey?: string | number;
};

/**
 * Loop estilo “boomerang”: avança no tempo do vídeo até ao fim e volta,
 * sem `playbackRate` negativo (pouco fiável em mobile).
 */
export function useVideoBoomerangLoop({
  videoRef,
  active,
  useNativeLoop,
  restartKey = 0,
}: UseVideoBoomerangLoopOptions) {
  useEffect(() => {
    if (!active || useNativeLoop) return;

    let raf = 0;
    let cancelled = false;
    const speed = 1;
    let direction = 1 as 1 | -1;
    let lastFrame = performance.now();

    const tick = (now: number) => {
      if (cancelled) return;
      const el = videoRef.current;
      if (!el) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const dur = el.duration;
      if (!Number.isFinite(dur) || dur <= 0.08) {
        raf = requestAnimationFrame(tick);
        return;
      }

      const dt = Math.min((now - lastFrame) / 1000, 0.12);
      lastFrame = now;

      const margin = 0.05;
      let next = el.currentTime + direction * speed * dt;

      if (direction === 1 && next >= dur - margin) {
        next = dur - margin;
        direction = -1;
      } else if (direction === -1 && next <= margin) {
        next = margin;
        direction = 1;
      }

      el.currentTime = next;
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      const el = videoRef.current;
      if (!el || cancelled) return;
      el.pause();
      el.currentTime = 0;
      direction = 1;
      lastFrame = performance.now();
      raf = requestAnimationFrame(tick);
    };

    const el = videoRef.current;
    if (!el) return undefined;

    if (el.readyState >= HTMLMediaElement.HAVE_METADATA) {
      start();
    } else {
      el.addEventListener("loadedmetadata", start, { once: true });
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [active, useNativeLoop, restartKey, videoRef]);
}
