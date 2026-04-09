"use client";

import { useEffect, useState } from "react";

const MD = 768;

/** Desativa parallax pesado em viewports estreitas ou preferência do sistema. */
export function useMobileParallaxOff() {
  const [off, setOff] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MD - 1}px)`);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const update = () => setOff(mq.matches || reduced.matches);

    update();
    mq.addEventListener("change", update);
    reduced.addEventListener("change", update);
    return () => {
      mq.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  return off;
}
