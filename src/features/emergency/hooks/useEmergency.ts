import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import {
  type GeoLocation,
  type LocationResult,
  getCurrentLocation,
  watchLocation,
  triggerVibration,
  stopVibration,
  getBestMapLink,
} from "@/lib/location";

export type EmergencyStatus = "idle" | "countdown" | "active" | "cancelled";

export interface EmergencyAlert {
  id: string;
  type: string;
  status: EmergencyStatus;
  location: GeoLocation | null;
  createdAt: string;
  /** 3 saniyelik geri sayım için kalan ms */
  countdownMs: number;
}

interface UseEmergencyOptions {
  /** Geri sayım süresi ms (varsayılan: 3000) */
  countdownDuration?: number;
  /** Aktif alarmda titreşim deseni */
  vibrationPattern?: number[];
}

const COUNTDOWN_DEFAULT = 3000;
const VIBRATION_PATTERN = [300, 200, 300, 200, 300, 200, 600];

export function useEmergency(options: UseEmergencyOptions = {}) {
  const {
    countdownDuration = COUNTDOWN_DEFAULT,
    vibrationPattern = VIBRATION_PATTERN,
  } = options;

  const [alert, setAlert] = useState<EmergencyAlert | null>(null);
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const vibrationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopWatchRef = useRef<(() => void) | null>(null);

  // Konum izlemeyi durdur
  const stopWatching = useCallback(() => {
    stopWatchRef.current?.();
    stopWatchRef.current = null;
  }, []);

  // Geri sayımı temizle
  const clearCountdown = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  // Titreşimi durdur
  const clearVibration = useCallback(() => {
    if (vibrationRef.current) {
      clearInterval(vibrationRef.current);
      vibrationRef.current = null;
    }
    stopVibration();
  }, []);

  // Alarm durumunu sıfırla
  const resetAlert = useCallback(() => {
    clearCountdown();
    clearVibration();
    stopWatching();
    setAlert(null);
  }, [clearCountdown, clearVibration, stopWatching]);

  // Konum al
  const fetchLocation = useCallback(async (): Promise<GeoLocation | null> => {
    const result: LocationResult = await getCurrentLocation(true, 8000);
    if (result.ok) {
      setLocation(result.location);
      setLocationError(null);
      return result.location;
    }
    setLocationError(result.error.message);
    return null;
  }, []);

  // Alarm başlat — 3 sn geri sayım, sonra aktif
  const triggerEmergency = useCallback(
    (type: string) => {
      resetAlert();

      const now = new Date().toISOString();
      const id = `emergency-${Date.now()}`;

      setAlert({
        id,
        type,
        status: "countdown",
        location: null,
        createdAt: now,
        countdownMs: countdownDuration,
      });

      // Konumu arka planda al
      void fetchLocation();

      // Geri sayım başlat
      let remaining = countdownDuration;
      countdownRef.current = setInterval(() => {
        remaining -= 100;
        if (remaining <= 0) {
          clearCountdown();
          // Aktif moda geç
          setAlert((prev) =>
            prev ? { ...prev, status: "active", countdownMs: 0 } : prev,
          );
          // Titreşimi başlat
          triggerVibration(vibrationPattern);
          vibrationRef.current = setInterval(() => {
            triggerVibration(vibrationPattern);
          }, 3000);
          toast.error("Acil durum aktif! Konumunuz paylaşılıyor.");
        } else {
          setAlert((prev) => (prev ? { ...prev, countdownMs: remaining } : prev));
        }
      }, 100);
    },
    [countdownDuration, clearCountdown, fetchLocation, resetAlert, vibrationPattern],
  );

  // Alarmı iptal et
  const cancelEmergency = useCallback(() => {
    const wasActive = alert?.status === "active";
    resetAlert();
    toast.success(wasActive ? "Acil durum iptal edildi" : "İptal edildi");
  }, [alert, resetAlert]);

  // Anlık paylaşım — mevcut konumu döndür
  const shareLocationNow = useCallback(async (): Promise<GeoLocation | null> => {
    const loc = await fetchLocation();
    if (loc) {
      const link = getBestMapLink(loc.latitude, loc.longitude);
      toast.success("Konumunuz hazır", {
        description: `${loc.latitude.toFixed(4)}, ${loc.longitude.toFixed(4)}`,
      });
      return loc;
    }
    toast.error("Konum alınamadı");
    return null;
  }, [fetchLocation]);

  // Bileşen unmount'ta temizle
  useEffect(() => {
    return () => {
      clearCountdown();
      clearVibration();
      stopWatching();
    };
  }, [clearCountdown, clearVibration, stopWatching]);

  // Pasif konum izleme — her zaman açık
  useEffect(() => {
    const stop = watchLocation(
      (loc) => setLocation(loc),
      () => {}, // sessizce yoksay
      true,
    );
    return stop;
  }, []);

  return {
    alert,
    location,
    locationError,
    isActive: alert?.status === "active",
    isCountdown: alert?.status === "countdown",
    triggerEmergency,
    cancelEmergency,
    shareLocationNow,
    resetAlert,
  };
}
