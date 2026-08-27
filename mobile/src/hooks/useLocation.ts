import { useCallback, useEffect, useRef, useState } from "react";
import * as Location from "expo-location";
import * as SMS from "expo-sms";
import * as Linking from "expo-linking";

export interface GeoPoint {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: string;
}

/**
 * useLocation — cihaz konumunu alır ve izler.
 */
export function useLocation() {
  const [location, setLocation] = useState<GeoPoint | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<boolean>(false);
  const watcherRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let mounted = true;
    void (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (!mounted) return;
        const granted = status === "granted";
        setPermission(granted);
        if (granted) {
          const loc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });
          if (!mounted) return;
          setLocation({
            latitude: loc.coords.latitude,
            longitude: loc.coords.longitude,
            accuracy: loc.coords.accuracy ?? undefined,
            timestamp: new Date().toISOString(),
          });
        }
      } catch {
        if (mounted) setError("Konum izni alınamadı");
      }
    })();
    return () => {
      mounted = false;
      watcherRef.current?.remove();
    };
  }, []);

  /** Geçici canlı takip başlat */
  const startWatching = useCallback(() => {
    if (watcherRef.current) return;
    void Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 15000,
        distanceInterval: 20,
      },
      (loc) => {
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          accuracy: loc.coords.accuracy ?? undefined,
          timestamp: new Date().toISOString(),
        });
      },
    ).then((sub) => {
      watcherRef.current = sub;
    });
  }, []);

  const stopWatching = useCallback(() => {
    watcherRef.current?.remove();
    watcherRef.current = null;
  }, []);

  async function getCurrent(): Promise<GeoPoint | null> {
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const p: GeoPoint = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        accuracy: loc.coords.accuracy ?? undefined,
        timestamp: new Date().toISOString(),
      };
      setLocation(p);
      return p;
    } catch {
      setError("Konum alınamadı");
      return null;
    }
  }

  return { location, error, permission, getCurrent, startWatching, stopWatching };
}

/**
 * Konum harita linki üretir — SMS'te gönderilebilir metin formu.
 */
export function locationToText(loc: GeoPoint): string {
  return `Konumum: ${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}\nhttps://maps.google.com/?q=${loc.latitude},${loc.longitude}`;
}

/**
 * useOfflineSMSFallback — internet kesilse bile SMS ile konum gönderimi.
 */
export function useOfflineSMSFallback() {
  const sendLocationSMS = useCallback(
    async (phone: string, loc: GeoPoint) => {
      const message = `NABİZ 🫀 ${locationToText(loc)}`;
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        await SMS.sendSMSAsync([phone], message);
        return true;
      }
      const url = `sms:${phone}?body=${encodeURIComponent(message)}`;
      await Linking.openURL(url);
      return true;
    },
    [],
  );

  const prepareLocationMessage = useCallback(async (loc: GeoPoint) => {
    return locationToText(loc);
  }, []);

  return { sendLocationSMS, prepareLocationMessage };
}
