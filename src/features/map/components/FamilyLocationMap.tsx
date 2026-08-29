import { useEffect, useState } from "react";
import { MapPin, Clock } from "lucide-react";

import { MapContainer } from "@/features/map/components/MapContainer";
import type { MapMarker } from "@/features/map/types/map";

interface FamilySpot {
  id: string;
  name: string;
  relation: string;
  emoji: string;
  place: string;
  loc: [number, number];
  lastActive: string;
  statusTone: "safe" | "pending" | "problem";
}

const FAMILY: FamilySpot[] = [
  {
    id: "p1",
    name: "Ayşe Yılmaz",
    relation: "Anne",
    emoji: "👩‍🦰",
    place: "Kadıköy",
    loc: [40.9907, 29.0236],
    lastActive: "2 dk önce",
    statusTone: "safe",
  },
  {
    id: "p2",
    name: "Mehmet Yılmaz",
    relation: "Baba",
    emoji: "👨‍🦳",
    place: "Üsküdar",
    loc: [41.0236, 29.015],
    lastActive: "12 dk önce",
    statusTone: "pending",
  },
  {
    id: "p3",
    name: "Elif",
    relation: "Kardeş",
    emoji: "👧",
    place: "Beşiktaş",
    loc: [41.043, 29.0065],
    lastActive: "1 sa önce",
    statusTone: "safe",
  },
  {
    id: "p6",
    name: "Fatma Nine",
    relation: "Babaanne",
    emoji: "👵",
    place: "Beyoğlu",
    loc: [41.0321, 28.9766],
    lastActive: "5 dk önce",
    statusTone: "problem",
  },
];

const STATUS_META = {
  safe: { label: "Güvenli", dot: "bg-emerald-500" },
  pending: { label: "Cevap yok", dot: "bg-amber-500" },
  problem: { label: "Dikkat", dot: "bg-red-500" },
} as const;

/**
 * "Ailem Nerede?" — aile güvenliği platformunun çekirdek aracı.
 * Sevdiklerinin son bilinen konumlarını haritada ve listede gösterir.
 * (Web MVP: konumlar mock veriyle simüle edilir; gerçekte realtime konum.)
 */
export function FamilyLocationMap() {
  const [myLocation, setMyLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => setMyLocation([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { enableHighAccuracy: true, timeout: 15000 },
    );
  }, []);

  const markers: MapMarker[] = [
    ...FAMILY.map((f) => ({
      id: f.id,
      lat: f.loc[0],
      lng: f.loc[1],
      label: f.name,
      emoji: f.emoji,
      color: f.statusTone === "problem" ? "#ef4444" : f.statusTone === "pending" ? "#f59e0b" : "#22c55e",
    })),
    ...(myLocation
      ? [
          {
            id: "me",
            lat: myLocation[0],
            lng: myLocation[1],
            label: "Sen (Dilos)",
            emoji: "📍",
            color: "#3b82f6",
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Ailem Nerede?</h2>
      </div>

      <MapContainer
        initialMarkers={markers}
        className="min-h-[320px]"
      />

      <div className="space-y-2">
        {FAMILY.map((f) => {
          const meta = STATUS_META[f.statusTone];
          return (
            <div
              key={f.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5"
            >
              <span className="text-xl">{f.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {f.name} · {f.place}
                </p>
                <p className="text-xs text-muted-foreground">{f.relation}</p>
              </div>
              <div className="text-right">
                <span className="flex items-center justify-end gap-1.5 text-xs">
                  <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                  <span className="font-medium text-foreground">{meta.label}</span>
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {f.lastActive}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
