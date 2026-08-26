import { MapPin, Navigation, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MeetingPoint as MeetingPointType } from "@/features/earthquake/data/mockEarthquake";

interface MeetingPointCardProps {
  point: MeetingPointType;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function buildGoogleMapsUrl(lat: number, lng: number, name: string) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(name)}`;
}

export function MeetingPointCard({ point, onEdit, onDelete }: MeetingPointCardProps) {
  const mapsUrl = buildGoogleMapsUrl(point.lat, point.lng, point.name);

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <MapPin className="h-6 w-6" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold">{point.name}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{point.address}</p>
          <p className="mt-1 text-sm font-medium text-primary">{point.distance}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "flex items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90",
          )}
        >
          <Navigation className="h-4 w-4" />
          Yol Tarifi Al
        </a>

        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(point.id)}
              className="flex-1 gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" />
              Düzenle
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(point.id)}
              className="flex-1 gap-1.5 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Sil
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
