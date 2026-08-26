import { useEffect } from "react";
import { Circle, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

interface LocationMarkerProps {
  position: [number, number] | null;
  accuracy: number;
  label?: string;
}

const userIcon = L.divIcon({
  className: "",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  html: `<div class="relative h-6 w-6">
    <span class="absolute inset-0 animate-ping rounded-full bg-blue-500/40"></span>
    <span class="absolute inset-1 rounded-full bg-blue-500 border-2 border-white shadow-lg"></span>
  </div>`,
});

export function LocationMarker({ position, accuracy, label = "Konumun" }: LocationMarkerProps) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, map.getZoom(), { duration: 1 });
    }
  }, [position, map]);

  if (!position) return null;

  return (
    <>
      {accuracy > 0 && (
        <Circle
          center={position}
          radius={accuracy}
          pathOptions={{
            color: "#3b82f6",
            fillColor: "#3b82f6",
            fillOpacity: 0.08,
            weight: 1,
          }}
        />
      )}
      <Marker position={position} icon={userIcon}>
        <Popup>{label}</Popup>
      </Marker>
    </>
  );
}
