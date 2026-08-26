import { useCallback, useEffect, useRef, useState } from "react";

type ConnectionQuality = "excellent" | "good" | "slow" | "offline";

interface NetworkStatus {
  isOnline: boolean;
  quality: ConnectionQuality;
  retry: <T>(fn: () => Promise<T>, maxAttempts?: number) => Promise<T>;
}

const RETRY_DELAYS = [1000, 2000, 4000, 8000, 16000];

function getQuality(): ConnectionQuality {
  if (!navigator.onLine) return "offline";
  const conn = (navigator as { connection?: { effectiveType?: string; downlink?: number } }).connection;
  if (!conn) return "good";
  if (conn.effectiveType === "slow-2g" || conn.effectiveType === "2g") return "slow";
  if (conn.downlink != null && conn.downlink < 1) return "slow";
  if (conn.effectiveType === "4g" || (conn.downlink != null && conn.downlink >= 5)) return "excellent";
  return "good";
}

export function useNetworkStatus(): NetworkStatus {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [quality, setQuality] = useState<ConnectionQuality>(getQuality);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      if (mountedRef.current) {
        setIsOnline(true);
        setQuality(getQuality());
      }
    };
    const handleOffline = () => {
      if (mountedRef.current) {
        setIsOnline(false);
        setQuality("offline");
      }
    };
    const handleConnectionChange = () => {
      if (mountedRef.current) setQuality(getQuality());
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    const conn = (navigator as { connection?: EventTarget }).connection;
    conn?.addEventListener("change", handleConnectionChange);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      conn?.removeEventListener("change", handleConnectionChange);
    };
  }, []);

  const retry = useCallback(
    async <T,>(fn: () => Promise<T>, maxAttempts = RETRY_DELAYS.length): Promise<T> => {
      let lastError: unknown;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          return await fn();
        } catch (err) {
          lastError = err;
          if (attempt < maxAttempts - 1) {
            const delay = RETRY_DELAYS[attempt] ?? RETRY_DELAYS[RETRY_DELAYS.length - 1];
            await new Promise((resolve) => setTimeout(resolve, delay));
          }
        }
      }
      throw lastError;
    },
    [],
  );

  return { isOnline, quality, retry };
}
