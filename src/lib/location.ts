export interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  /** ISO 8601 zaman damgası */
  timestamp: string;
}

export interface LocationError {
  code: "PERMISSION_DENIED" | "POSITION_UNAVAILABLE" | "TIMEOUT" | "UNKNOWN";
  message: string;
}

export type LocationResult =
  | { ok: true; location: GeoLocation }
  | { ok: false; error: LocationError };

function isGeolocationAvailable(): boolean {
  return "geolocation" in navigator;
}

function positionToLocation(pos: GeolocationPosition): GeoLocation {
  return {
    latitude: pos.coords.latitude,
    longitude: pos.coords.longitude,
    accuracy: pos.coords.accuracy,
    timestamp: new Date(pos.timestamp).toISOString(),
  };
}

function geolocationErrorToLocationError(err: GeolocationPositionError): LocationError {
  switch (err.code) {
    case err.PERMISSION_DENIED:
      return { code: "PERMISSION_DENIED", message: "Konum izni reddedildi" };
    case err.POSITION_UNAVAILABLE:
      return { code: "POSITION_UNAVAILABLE", message: "Konum bilgisi alınamadı" };
    case err.TIMEOUT:
      return { code: "TIMEOUT", message: "Konum isteği zaman aşımına uğradı" };
    default:
      return { code: "UNKNOWN", message: "Bilinmeyen konum hatası" };
  }
}

/**
 * Tek seferlik konum alma.
 * @param highAccuracy Yüksek doğruluk isteyip istenmediği (varsayılan: true)
 * @param timeoutMs Zaman aşımı milisaniye (varsayılan: 10000)
 */
export function getCurrentLocation(
  highAccuracy = true,
  timeoutMs = 10_000,
): Promise<LocationResult> {
  if (!isGeolocationAvailable()) {
    return Promise.resolve({
      ok: false,
      error: { code: "UNKNOWN", message: "Tarayıcınız konum servisini desteklemiyor" },
    });
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ ok: true, location: positionToLocation(pos) }),
      (err) => resolve({ ok: false, error: geolocationErrorToLocationError(err) }),
      {
        enableHighAccuracy: highAccuracy,
        timeout: timeoutMs,
        maximumAge: 60_000,
      },
    );
  });
}

/**
 * Sürekli konum takibi başlatır.
 * Her güncelleme callback'e yeni konum yollar.
 * Durdurma için returned fonksiyonu çağır.
 */
export function watchLocation(
  onUpdate: (location: GeoLocation) => void,
  onError: (error: LocationError) => void,
  highAccuracy = true,
): () => void {
  if (!isGeolocationAvailable()) {
    onError({ code: "UNKNOWN", message: "Tarayıcınız konum servisini desteklemiyor" });
    return () => {};
  }

  const watchId = navigator.geolocation.watchPosition(
    (pos) => onUpdate(positionToLocation(pos)),
    (err) => onError(geolocationErrorToLocationError(err)),
    {
      enableHighAccuracy: highAccuracy,
      maximumAge: 10_000,
    },
  );

  return () => navigator.geolocation.clearWatch(watchId);
}

/**
 * Konum izni durumunu kontrol eder.
 * permission-query mevcut değilse "unknown" döner.
 */
export async function checkLocationPermission(): Promise<"granted" | "denied" | "prompt" | "unknown"> {
  if (!isGeolocationAvailable()) return "unknown";

  if ("permissions" in navigator) {
    try {
      const result = await navigator.permissions.query({ name: "geolocation" });
      return result.state;
    } catch {
      return "unknown";
    }
  }

  return "unknown";
}

/**
 * Konum izni ister — kullanıcıya tarayıcı izin diyaloğunu gösterir.
 */
export async function requestLocationPermission(): Promise<"granted" | "denied" | "unknown"> {
  const result = await getCurrentLocation(true, 5000);
  if (result.ok) return "granted";
  if (result.error.code === "PERMISSION_DENIED") return "denied";
  return "unknown";
}

/**
 * Konum linki üretir — harita uygulamasına yönlendirme için.
 */
export function buildGoogleMapsLink(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

export function buildAppleMapsLink(lat: number, lng: number): string {
  return `https://maps.apple.com/?ll=${lat},${lng}&q=${lat},${lng}`;
}

export function buildOpenStreetMapLink(lat: number, lng: number): string {
  return `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=16/${lat}/${lng}`;
}

export function getBestMapLink(lat: number, lng: number): string {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  return isIOS ? buildAppleMapsLink(lat, lng) : buildGoogleMapsLink(lat, lng);
}

/**
 * IP tabanlı fallback konum — geolocation çalışmazsa.
 * Coğrafi doğruluk düşüktür (şehir/seviye).
 */
export async function getIPBasedLocation(): Promise<LocationResult> {
  try {
    const res = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error("IP tabanlı konum alınamadı");
    const data = (await res.json()) as { latitude: number; longitude: number };

    return {
      ok: true,
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: 50_000,
        timestamp: new Date().toISOString(),
      },
    };
  } catch {
    return {
      ok: false,
      error: { code: "UNKNOWN", message: "Konum bilgisi alınamadı" },
    };
  }
}

/**
 * Tüm методларı dener: GPS → IP fallback.
 */
export async function getLocationWithFallback(): Promise<LocationResult> {
  const gpsResult = await getCurrentLocation();
  if (gpsResult.ok) return gpsResult;
  return getIPBasedLocation();
}

/**
 * Vibrasyon API wrapper — alarm için.
 */
export function triggerVibration(pattern?: number[]): boolean {
  if (!("vibrate" in navigator)) return false;
  navigator.vibrate(pattern ?? [200, 100, 200, 100, 200, 100, 400]);
  return true;
}

export function stopVibration(): void {
  if ("vibrate" in navigator) {
    navigator.vibrate(0);
  }
}
