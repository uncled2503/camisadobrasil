"use client";

import { type RefObject, useEffect } from "react";

type Options = {
  enabled: boolean;
  mediaKey: string;
};

/**
 * Safari/iOS: reforça muted/inline e várias tentativas de `play()` (metadata,
 * canplay, viewport, visibilidade).
 */
export function useInlineMutedVideoAutoplay(
  videoRef: RefObject<HTMLVideoElement | null>,
  { enabled, mediaKey }: Options
) {
  useEffect(() => {
    if (!enabled) return;
    const v = videoRef.current;
    if (!v) return;

    // Força propriedades essenciais para autoplay mobile
    v.muted = true;
    v.defaultMuted = true;
    v.volume = 0;
    v.playsInline = true;
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "true");
    v.setAttribute("muted", "");

    const attempt = () => {
      const playPromise = v.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Se falhou (ex: Low Power Mode), tentamos novamente no próximo evento de interação
          // ou quando o vídeo estiver pronto.
        });
      }
    };

    // Tenta mal monta
    attempt();

    // Tenta quando carregar metadados e quando puder tocar
    const onMeta = () => attempt();
    const onCanPlay = () => attempt();
    
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("canplay", onCanPlay);
    // Em alguns casos de rede lenta, o vídeo pode suspender
    v.addEventListener("suspend", onCanPlay);

    // Intersection Observer para tocar quando entrar no ecrã (economiza bateria e garante play)
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting && e.intersectionRatio > 0.05)) {
          attempt();
        }
      },
      { threshold: [0, 0.05, 0.1] }
    );
    io.observe(v);

    const onVis = () => {
      if (document.visibilityState === "visible") attempt();
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