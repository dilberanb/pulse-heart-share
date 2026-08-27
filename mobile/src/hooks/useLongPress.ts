import { useCallback, useRef, useState } from "react";

/**
 * useLongPress — basılı tutma algılar.
 * onTrigger yalnızca basılı tutma süresi boyunca tutma devam ederse tetiklenir.
 * progress: 0..1 — buton dolgusunda kullanılır.
 */
export function useLongPress({
  onTrigger,
  duration = 1500,
  disabled = false,
}: {
  onTrigger: () => void;
  duration?: number;
  disabled?: boolean;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startRef = useRef<number>(0);
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startRef.current = 0;
    setIsPressing(false);
    setProgress(0);
  }, []);

  const start = useCallback(() => {
    if (disabled) return;
    startRef.current = Date.now();
    setIsPressing(true);
    setProgress(0);
    // İlerleme animasyonu — her 50ms güncelle
    const interval = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      setProgress(Math.min(1, elapsed / duration));
    }, 50);
    timerRef.current = setTimeout(() => {
      clearInterval(interval);
      setIsPressing(false);
      setProgress(1);
      onTrigger();
    }, duration);
  }, [disabled, duration, onTrigger]);

  const end = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsPressing(false);
    setProgress(0);
  }, []);

  return { start, end, clearTimer, isPressing, progress };
}
