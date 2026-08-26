import { useState, useCallback } from "react";
import {
  MapPin,
  Loader2,
  Navigation,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type GeoLocation,
  type LocationResult,
  getCurrentLocation,
  getBestMapLink,
  buildGoogleMapsLink,
  buildAppleMapsLink,
  checkLocationPermission,
} from "@/lib/location";

export function LocationShare() {
  const [location, setLocation] = useState<GeoLocation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<string | null>(null);

  const fetchLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    const perm = await checkLocationPermission();
    setPermissionState(perm);

    if (perm === "denied") {
      setError("Konum izni reddedildi. Tarayıcı ayarlarından izin verin.");
      setLoading(false);
      return;
    }

    const result: LocationResult = await getCurrentLocation(true, 10_000);

    if (result.ok) {
      setLocation(result.location);
    } else {
      setError(result.error.message);
    }

    setLoading(false);
  }, []);

  const mapsLink = location ? getBestMapLink(location.latitude, location.longitude) : null;

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold">Konum Paylaşımı</h2>
      <p className="text-sm text-muted-foreground">
        Mevcut konumunuzu alıp harita bağlantısı oluşturun.
      </p>

      {!location && (
        <Button
          onClick={() => void fetchLocation()}
          disabled={loading}
          className="h-14 w-full gap-2 rounded-2xl text-base"
          variant="outline"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <MapPin className="h-5 w-5" />
          )}
          {loading ? "Konum alınıyor…" : "Konumumu Al"}
        </Button>
      )}

      {permissionState === "denied" && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          Konum izni reddedildi. Tarayıcı ayarlarından konum iznini etkinleştirin.
        </div>
      )}

      {error && !permissionState && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {location && (
        <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Navigation className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-mono text-sm">
                {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Doğruluk: {Math.round(location.accuracy)}m
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <a
              href={mapsLink ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
                !mapsLink && "pointer-events-none opacity-50",
              )}
            >
              <ExternalLink className="h-4 w-4" />
              Haritada Aç
            </a>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={buildGoogleMapsLink(location.latitude, location.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 rounded-xl border border-border py-2.5 text-xs font-medium transition-colors hover:bg-accent"
              >
                Google Maps
              </a>
              <a
                href={buildAppleMapsLink(location.latitude, location.longitude)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 rounded-xl border border-border py-2.5 text-xs font-medium transition-colors hover:bg-accent"
              >
                Apple Maps
              </a>
            </div>

            <Button
              onClick={() => void fetchLocation()}
              variant="ghost"
              size="sm"
              className="mt-1 gap-1.5 text-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Konumu Güncelle
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
