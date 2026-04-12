"use client";

import { useEffect, useRef, useState } from "react";

const POLL_MS = 2000;

export type PixPaymentConfirmation = {
  /** True quando o webhook gravou `paid` no Supabase para este id. */
  confirmed: boolean;
  /** False se falta SUPABASE_SERVICE_ROLE_KEY ou tabela — confirmação automática indisponível. */
  trackingAvailable: boolean;
};

/**
 * Consulta `/api/pix/payment-status` até o Pix ser marcado como pago no servidor.
 */
export function usePixPaymentConfirmation(transactionId: string | undefined): PixPaymentConfirmation {
  const [confirmed, setConfirmed] = useState(false);
  const [trackingAvailable, setTrackingAvailable] = useState(true);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!transactionId?.trim()) {
      setConfirmed(false);
      setTrackingAvailable(true);
      return;
    }

    setConfirmed(false);
    setTrackingAvailable(true);

    let cancelled = false;

    const clearPoll = () => {
      if (intervalRef.current != null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    const poll = async () => {
      try {
        const res = await fetch(
          `/api/pix/payment-status?transactionId=${encodeURIComponent(transactionId.trim())}`,
          { cache: "no-store" }
        );
        const j = (await res.json()) as { paid?: boolean; trackingAvailable?: boolean };
        if (cancelled) return;
        if (j.trackingAvailable === false) {
          setTrackingAvailable(false);
        }
        if (j.paid === true) {
          setConfirmed(true);
          clearPoll();
        }
      } catch {
        if (!cancelled) setTrackingAvailable(false);
      }
    };

    void poll();
    intervalRef.current = window.setInterval(poll, POLL_MS);
    return () => {
      cancelled = true;
      clearPoll();
    };
  }, [transactionId]);

  return { confirmed, trackingAvailable };
}
