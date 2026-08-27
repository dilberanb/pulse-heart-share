import { useRef, useState, useEffect, useCallback, type RefObject } from "react";

/**
 * useLongPress — SOS gibi kritik eylemlerde yanlış dokunuşu önlemek için
 * belirli bir süre basılı tutma gerektiren etkileşim.
 *
 * Basılı tutma ilerlemesini yüzde olarak döndürür (UI'da görsel dolgu için).
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
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const onTriggerRef = useRef(onTrigger);
  onTriggerRef.current = onTrigger;

  const clearAll = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timerRef.current = null;
    intervalRef.current = null;
    setProgress(0);
    setIsPressing(false);
  }, []);

  const start = useCallback(
    (e?: { preventDefault?: () => void }) => {
      if (disabled) return;
      e?.preventDefault?.();
      setIsPressing(true);
      setProgress(0);
      const stepMs = 50;
      const totalSteps = duration / stepMs;
      let step = 0;
      intervalRef.current = setInterval(() => {
        step += 1;
        setProgress(Math.min(1, step / totalSteps));
      }, stepMs);
      timerRef.current = setTimeout(() => {
        clearAll();
        onTriggerRef.current();
      }, duration);
    },
    [disabled, duration, clearAll],
  );

  const end = useCallback(() => {
    clearAll();
  }, [clearAll]);

  useEffect(() => () => clearAll(), [clearAll]);

  return { start, end, isPressing, progress };
}

/**
 * Bir bileşenin üzerine long-press dinleyicilerini yaymak için yardımcı.
 * Props'ları doğrudan Touchable'a ver:
 *
 *   const longPress = useLongPress({ onTrigger });
 *   <TouchableOpacity {...longPress.pressProps}>
 *
 * Ya da <View> içinde pointer olayları için:
 *
 *   <View onPointerDown={longPress.start} onPointerUp={longPress.end}
 *         onPointerLeave={longPress.end} onPointerCancel={longPress.end}>
 */
export function useLongPressProps({
  onTrigger,
  duration = 1500,
  disabled = false,
}: {
  onTrigger: () => void;
  duration?: number;
  disabled?: boolean;
}) {
  const { start, end, progress, isPressing } = useLongPress({
    onTrigger,
    duration,
    disabled,
  });
  return {
    pressProps: {
      onPressIn: start,
      onPressOut: end,
      onLongPress: end,
    },
    pointerProps: {
      onPointerDown: start,
      onPointerUp: end,
      onPointerLeave: end,
      onPointerCancel: end,
    },
    progress,
    isPressing,
  };
}

export type { RefObject };
