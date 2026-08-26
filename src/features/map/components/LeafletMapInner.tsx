import { useEffect } from "react";
import { Circle, MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

import type { MapMarker } from "@/features/map/types/map";

function MapController({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function makeEmergencyIcon() {
  return L.divIcon({
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    html: `<div class="relative h-8 w-8 flex items-center justify-center">
      <span class="absolute inset-0 animate-ping rounded-full bg-red-500/30"></span>
      <span class="absolute inset-0.5 rounded-full bg-red-500/60"></span>
      <span class="relative text-lg">🚨</span>
    </div>`,
  });
}

function makeUserIcon(color = "#3b82f6") {
  return L.divIcon({
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    html: `<div style="background:${color}" class="h-7 w-7 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-xs font-bold text-white">👤</div>`,
  });
}

function makeUserLocationIcon() {
  return L.divIcon({
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    html: `<div class="relative h-6 w-6">
      <span class="absolute inset-0 animate-ping rounded-full bg-blue-500/40"></span>
      <span class="absolute inset-1 rounded-full bg-blue-500 border-2 border-white shadow-lg"></span>
    </div>`,
  });
}

interface LeafletMapInnerProps {
  markers: MapMarker[];
  userLocation: [number, number] | null;
  accuracy: number;
  theme: "light" | "dark";
  center: [number, number];
  zoom: number;
}

export default function LeafletMapInner({
  markers,
  userLocation,
  accuracy,
  theme,
  center,
  zoom,
}: LeafletMapInnerProps) {
  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const attribution =
    theme === "dark"
      ? '© <a href="https://carto.com/">CARTO</a>'
      : '© <a href="https://osm.org/copyright">OpenStreetMap</a>';

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="h-full w-full rounded-2xl"
      zoomControl={false}
    >
      <MapController center={center} zoom={zoom} />
      <TileLayer url={tileUrl} attribution={attribution} />

      {userLocation && (
        <>
          {accuracy > 0 && (
            <Circle
              center={userLocation}
              radius={accuracy}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#3b82f6",
                fillOpacity: 0.08,
                weight: 1,
              }}
            />
          )}
          <Marker position={userLocation} icon={makeUserLocationIcon()}>
            <Popup>Konumun</Popup>
          </Marker>
        </>
      )}

      {markers.map((marker) => {
        const icon = marker.isEmergency ? makeEmergencyIcon() : makeUserIcon(marker.color);
        return (
          <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={icon}>
            <Popup>
              <div className="text-center">
                {marker.emoji && <span className="text-xl">{marker.emoji}</span>}
                <p className="mt-1 text-sm font-semibold">{marker.label}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
