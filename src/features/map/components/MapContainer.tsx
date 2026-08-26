import { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { MapPin, Moon, Sun, Crosshair } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMap as useMapState } from "@/features/map/hooks/useMap";
import type { MapMarker } from "@/features/map/types/map";
import { cn } from "@/lib/utils";

const LeafletMap = lazy(() => import("./LeafletMapInner"));

interface MapContainerProps {
  className?: string;
  initialMarkers?: MapMarker[];
}

export function MapContainer({ className, initialMarkers = [] }: MapContainerProps) {
  const {
    center,
    zoom,
    markers: stateMarkers,
    userLocation,
    accuracy,
    theme,
    isTracking,
    setTheme,
    addMarker,
    startTracking,
    stopTracking,
    setCenter,
  } = useMapState();

  const allMarkers = useMemo(
    () => [...initialMarkers, ...stateMarkers],
    [initialMarkers, stateMarkers],
  );

  useEffect(() => {
    initialMarkers.forEach((m) => addMarker(m));
  }, []);

  return (
    <div className={cn("relative flex flex-col", className)}>
      <div className="absolute right-3 top-3 z-[1000] flex flex-col gap-2">
        <Button
          variant="secondary"
          size="icon"
          className="h-9 w-9 rounded-xl shadow-md bg-background/90 backdrop-blur"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          title={theme === "light" ? "Karanlık mod" : "Aydınlık mod"}
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className={cn(
            "h-9 w-9 rounded-xl shadow-md bg-background/90 backdrop-blur",
            isTracking && "bg-blue-500 text-white hover:bg-blue-600",
          )}
          onClick={isTracking ? stopTracking : startTracking}
          title={isTracking ? "Konum takibi durdur" : "Konum takibi başlat"}
        >
          <Crosshair className="h-4 w-4" />
        </Button>
        <Button
          variant="secondary"
          size="icon"
          className="h-9 w-9 rounded-xl shadow-md bg-background/90 backdrop-blur"
          onClick={() => {
            if (userLocation) setCenter(userLocation);
          }}
          title="Konumuma git"
        >
          <MapPin className="h-4 w-4" />
        </Button>
      </div>

      <div className="min-h-[300px] flex-1 overflow-hidden rounded-2xl border border-border">
        <Suspense
          fallback={
            <div className="flex h-full min-h-[300px] items-center justify-center bg-muted/30">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-sm">Harita yükleniyor…</p>
              </div>
            </div>
          }
        >
          <LeafletMap
            markers={allMarkers}
            userLocation={userLocation}
            accuracy={accuracy}
            theme={theme}
            center={center}
            zoom={zoom}
          />
        </Suspense>
      </div>

      <div className="flex items-center justify-between px-3 py-2 text-xs text-muted-foreground">
        <span>
          {allMarkers.length > 0
            ? `${allMarkers.length} işaretçi haritada`
            : "Henüz işaretçi yok"}
        </span>
        <span>{isTracking ? "Canlı takip açık" : "Takip kapalı"}</span>
      </div>
    </div>
  );
}

export type { MapMarker };
