export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label: string;
  emoji?: string;
  color?: string;
  isEmergency?: boolean;
  accuracy?: number;
}

export interface MapState {
  center: [number, number];
  zoom: number;
  markers: MapMarker[];
  userLocation: [number, number] | null;
  accuracy: number;
  theme: "light" | "dark";
  isTracking: boolean;
}
