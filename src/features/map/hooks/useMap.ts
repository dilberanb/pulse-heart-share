import { useCallback, useRef, useState } from "react";

import type { MapMarker, MapState } from "@/features/map/types/map";

const DEFAULT_CENTER: [number, number] = [39.9334, 32.8597];
const DEFAULT_ZOOM = 6;

export function useMap() {
  const [state, setState] = useState<MapState>({
    center: DEFAULT_CENTER,
    zoom: DEFAULT_ZOOM,
    markers: [],
    userLocation: null,
    accuracy: 0,
    theme: "light",
    isTracking: false,
  });

  const watchIdRef = useRef<number | null>(null);

  const setCenter = useCallback((center: [number, number]) => {
    setState((prev) => ({ ...prev, center }));
  }, []);

  const setZoom = useCallback((zoom: number) => {
    setState((prev) => ({ ...prev, zoom }));
  }, []);

  const setTheme = useCallback((theme: "light" | "dark") => {
    setState((prev) => ({ ...prev, theme }));
  }, []);

  const addMarker = useCallback((marker: MapMarker) => {
    setState((prev) => ({
      ...prev,
      markers: prev.markers.some((m) => m.id === marker.id)
        ? prev.markers.map((m) => (m.id === marker.id ? marker : m))
        : [...prev.markers, marker],
    }));
  }, []);

  const removeMarker = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      markers: prev.markers.filter((m) => m.id !== id),
    }));
  }, []);

  const clearMarkers = useCallback(() => {
    setState((prev) => ({ ...prev, markers: [] }));
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) return;

    setState((prev) => ({ ...prev, isTracking: true }));

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const loc: [number, number] = [position.coords.latitude, position.coords.longitude];
        setState((prev) => ({
          ...prev,
          userLocation: loc,
          center: loc,
          accuracy: position.coords.accuracy,
        }));
      },
      () => {
        setState((prev) => ({ ...prev, isTracking: false }));
      },
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 30_000 },
    );

    watchIdRef.current = id;
  }, []);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setState((prev) => ({ ...prev, isTracking: false }));
  }, []);

  const flyTo = useCallback((center: [number, number], zoom?: number) => {
    setState((prev) => ({
      ...prev,
      center,
      zoom: zoom ?? prev.zoom,
    }));
  }, []);

  return {
    ...state,
    setCenter,
    setZoom,
    setTheme,
    addMarker,
    removeMarker,
    clearMarkers,
    startTracking,
    stopTracking,
    flyTo,
  };
}
