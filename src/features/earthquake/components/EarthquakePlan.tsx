import { useState } from "react";
import {
  MapPin,
  ClipboardList,
  Package,
  CheckCircle2,
  Circle,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MeetingPointCard } from "@/features/earthquake/components/MeetingPoint";
import {
  MOCK_MEETING_POINTS,
  EMERGENCY_KIT_ITEMS,
  EARTHQUAKE_PLAN_STEPS,
  type EmergencyKitItem,
} from "@/features/earthquake/data/mockEarthquake";

export function EarthquakePlan() {
  const [kitItems, setKitItems] = useState<EmergencyKitItem[]>(EMERGENCY_KIT_ITEMS);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [meetingPoints, setMeetingPoints] = useState(MOCK_MEETING_POINTS);

  const completedCount = kitItems.filter((i) => i.checked).length;

  function toggleKitItem(id: string) {
    setKitItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item,
      ),
    );
  }

  function handleDeletePoint(id: string) {
    setMeetingPoints((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* En Yakın Toplanma Alanı */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">En Yakın Toplanma Alanı</h2>
            <p className="text-xs text-muted-foreground">Acil durumda ilk gideceğin yer</p>
          </div>
        </div>

        {meetingPoints.length > 0 && meetingPoints[0] && (
          <MeetingPointCard point={meetingPoints[0]} />
        )}
      </section>

      {/* Toplanma Noktalarım */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold">Toplanma Noktalarım</h2>
          </div>
          <Badge variant="secondary">{meetingPoints.length} nokta</Badge>
        </div>

        <div className="space-y-3">
          {meetingPoints.map((point) => (
            <MeetingPointCard
              key={point.id}
              point={point}
              onDelete={handleDeletePoint}
            />
          ))}
        </div>
      </section>

      {/* Aile Deprem Planım */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <ClipboardList className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-bold">Aile Deprem Planım</h2>
        </div>

        <div className="space-y-2">
          {EARTHQUAKE_PLAN_STEPS.map((step) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
              className="w-full rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-accent"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-2xl">{step.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      {step.id}
                    </span>
                    <p className="text-sm font-semibold">{step.title}</p>
                  </div>
                  {expandedStep === step.id && (
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  )}
                </div>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                    expandedStep === step.id && "rotate-90",
                  )}
                />
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Acil Durum Çantam */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Package className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-bold">Acil Durum Çantam</h2>
          </div>
          <Badge variant="secondary">
            {completedCount}/{kitItems.length}
          </Badge>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {kitItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleKitItem(item.id)}
                  className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-accent"
                >
                  {item.checked ? (
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />
                  )}
                  <span
                    className={cn(
                      "text-sm",
                      item.checked && "text-muted-foreground line-through",
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="relative h-2 overflow-hidden rounded-full bg-secondary">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-300"
            style={{ width: `${(completedCount / kitItems.length) * 100}%` }}
          />
        </div>
        <p className="text-center text-xs text-muted-foreground">
          {completedCount === kitItems.length
            ? "Çantan hazır!"
            : `${kitItems.length - completedCount} ürün eksik`}
        </p>
      </section>
    </div>
  );
}
