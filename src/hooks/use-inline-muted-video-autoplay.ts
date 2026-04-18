"use client";

import { type RefObject, useEffect } from "react";

type Options = {
  enabled: boolean;
  mediaKey: string;
};

/**
 * Motor otimizado de autoplay para mobile/desktop.
 * Só reproduz o vídeo quando este está visível no ecrã e PAUSA imediatamente
 * quando sai do ecrã para poupar GPU, bateria e largura de banda.
 */
export function useInlineMutedVideoAutoplay(
  videoRef: RefObject<HTMLVideoElement | null>,
  { enabled, mediaKey }: Options
) {
  useEffect(() => {
    if (!enabled) return;
    const v = videoRef.current;
    if (!v) return;

    // Força propriedades essenciais para autoplay mobile sem som
    v.muted = true;
    v.defaultMuted = true;
    v.volume = 0;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "true");
    v.setAttribute("muted", "");

    let isVisible = false;

    const attemptPlay = () => {
      if (!isVisible) return;
      const playPromise = v.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Ignora erros de interrupção ou restrições de power-saving
        });
      }
    };

    const attemptPause = () => {
      if (!v.paused) {
        v.pause();
      }
    };

    const onMeta = () => attemptPlay();
    const onCanPlay = () => attemptPlay();
    
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("canplay", onCanPlay);
    v.addEventListener("suspend", onCanPlay);

    // Intersection Observer de alta precisão
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            isVisible = true;
            attemptPlay();
          } else {
            isVisible = false;
            attemptPause();
          }
        });
      },
      { threshold: 0.01 } // Deteta entrada/saída imediatamente
    );
    io.observe(v);

    const onVis = () => {
      if (document.visibilityState === "visible") {
        attemptPlay();
      } else {
        attemptPause();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("canplay", onCanPlay);
      v.removeEventListener("suspend", onCanPlay);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
    };
  }, [enabled, mediaKey, videoRef]);
}