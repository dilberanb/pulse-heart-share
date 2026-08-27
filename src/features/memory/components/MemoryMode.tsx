import { useMemo, useState } from "react";
import {
  CalendarDays,
  Clock,
  MapPin,
  Home,
  Bell,
  Phone,
  ShieldAlert,
  Check,
  Droplets,
  Pill,
  Utensils,
  Footprints,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  MOCK_MEMORY_PROFILE,
  MOCK_REMINDERS,
  todayTurkish,
  nowTurkish,
  type ReminderTask,
} from "@/features/memory/data/mockMemory";

const CATEGORY_META: Record<
  ReminderTask["category"],
  { icon: typeof Pill; color: string }
> = {
  medication: { icon: Pill, color: "text-rose-400" },
  water: { icon: Droplets, color: "text-sky-400" },
  food: { icon: Utensils, color: "text-amber-400" },
  activity: { icon: Footprints, color: "text-emerald-400" },
};

export function MemoryMode() {
  const profile = MOCK_MEMORY_PROFILE;
  const [reminders, setReminders] = useState<ReminderTask[]>(MOCK_REMINDERS);
  const [geoState, setGeoState] = useState<
    { lat: number; lng: number } | "unknown" | null
  >(null);
  const [missing, setMissing] = useState(false);
  const [detectedInside, setDetectedInside] = useState(true);

  const dateLine = useMemo(() => todayTurkish(), []);
  const time = useMemo(() => nowTurkish(), []);

  /** Kimlik kartı — karışıklık anında ne söyleyeceğini ve nereye döneceğini hatırlatır */
  const remindIdentity = () => {
    window.speechSynthesis?.cancel();
    const daughter = profile.familyFacts[0]?.value ?? "";
    const son = profile.familyFacts[1]?.value ?? "";
    const text = `Benim adım ${profile.name}. Kızım ${daughter}, oğlum ${son}. Evim ${profile.address} adresinde.`;
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = "tr-TR";
    window.speechSynthesis?.speak(msg);
  };

  const toggleReminder = (id: string) => {
    setReminders((rs) =>
      rs.map((r) => (r.id === id ? { ...r, done: !r.done } : r)),
    );
  };

  /** Güvenli bölge kontrolü — evden uzaklaşırsa bildirim */
  const checkSafeZone = () => {
    if (!navigator.geolocation) {
      setGeoState("unknown");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const distance = Math.sqrt(
          Math.pow(latitude - profile.homeGeocode.lat, 2) +
            Math.pow(longitude - profile.homeGeocode.lng, 2),
        ) * 111000;
        setGeoState({ lat: latitude, lng: longitude });
        const inside = distance < profile.safeZoneRadiusMeters;
        setDetectedInside(inside);
        if (!inside) setMissing(true);
      },
      () => setGeoState("unknown"),
    );
  };

  const startMissingAlert = () => {
    setMissing(true);
  };

  const callCaregiver = () => {
    window.open(`tel:${profile.caregiverPhone.replace("+", "")}`, "_self");
  };

  const openRouteHome = () => {
    if (geoState && geoState !== "unknown") {
      window.open(
        `https://www.google.com/maps/dir/${geoState.lat},${geoState.lng}/${profile.homeGeocode.lat},${profile.homeGeocode.lng}`,
        "_blank",
      );
    } else {
      window.open(
        `https://www.google.com/maps?q=${profile.homeGeocode.lat},${profile.homeGeocode.lng}`,
        "_blank",
      );
    }
  };

  return (
    <div className="space-y-5">
      {/* Zaman oryantasyonu */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-sky-500/10">
            <CalendarDays className="h-5 w-5 text-sky-400" />
          </span>
          <div>
            <p className="text-lg font-bold text-foreground">{dateLine}</p>
            <p className="text-sm text-muted-foreground">Saat {time}</p>
          </div>
        </div>
      </div>

      {/* Kimlik kartı */}
      <div className="rounded-2xl border border-primary/30 bg-card p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full border-2 border-primary bg-primary/10 text-2xl font-black text-primary">
              {profile.name[0]}
            </div>
            <div>
              <p className="text-xl font-black text-foreground">Benim adım {profile.name}</p>
              <p className="text-sm text-muted-foreground">İstanbul · Düzce</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Evim: {profile.address}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={remindIdentity} className="shrink-0">
            <Bell className="mr-1.5 h-4 w-4" />
            Sesli Hatırlat
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {profile.familyFacts.map((f) => (
            <div
              key={f.label}
              className="rounded-lg bg-muted/40 px-3 py-2 text-center"
            >
              <span className="block text-[11px] text-muted-foreground">{f.label}</span>
              <span className="block text-sm font-bold text-foreground">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hatırlatıcılar */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10">
            <Clock className="h-4 w-4 text-primary" />
          </span>
          <h3 className="text-sm font-bold text-foreground">Günlük Hatırlatıcılar</h3>
        </div>
        <div className="space-y-2">
          {reminders.map((r) => {
            const meta = CATEGORY_META[r.category]!;
            const Icon = meta.icon;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => toggleReminder(r.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg bg-muted/30 px-3 py-2.5 text-left transition-colors hover:bg-muted/50",
                  r.done && "opacity-50",
                )}
              >
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted/60",
                    meta.color,
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex-1">
                  <span
                    className={cn(
                      "block text-sm font-semibold text-foreground",
                      r.done && "line-through",
                    )}
                  >
                    {r.title}
                  </span>
                  <span className="text-xs text-muted-foreground">{r.time}</span>
                </span>
                {r.done && <Check className="h-4 w-4 shrink-0 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Güvenli bölge + kaybolma */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/10">
            <MapPin className="h-4 w-4 text-emerald-400" />
          </span>
          <h3 className="text-sm font-bold text-foreground">Güvenli Bölge</h3>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          {profile.name} evden {profile.safeZoneRadiusMeters} metre uzaklaşırsa bakım verene
          otomatik bildirim gider.
        </p>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={checkSafeZone}>
            <MapPin className="mr-1.5 h-4 w-4" />
            Konumu Kontrol Et
          </Button>
          <Button variant="outline" onClick={openRouteHome}>
            <Home className="mr-1.5 h-4 w-4" />
            Eve Götür (Rota)
          </Button>
        </div>

        {geoState === "unknown" && (
          <p className="mt-3 text-xs text-amber-400">
            Konum alınamadı. Lütfen konum iznini kontrol et.
          </p>
        )}
        {geoState && geoState !== "unknown" && (
          <p
            className={cn(
              "mt-3 text-xs",
              detectedInside ? "text-emerald-400" : "text-rose-400",
            )}
          >
            {detectedInside
              ? "Kişi güvenli bölgenin içinde. ✓"
              : "Dikkat: Kişi güvenli bölgenin dışında!"}
          </p>
        )}

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-500/10 px-3 py-2">
          <ShieldAlert className="h-5 w-5 shrink-0 text-rose-400" />
          <span className="text-xs text-rose-300">
            Kaybolma riskinde «Kayboldu — Bildir» ile bakım veren
            ({profile.caregiverName}) hemen aranır.
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            variant={missing ? "outline" : "destructive"}
            onClick={startMissingAlert}
          >
            <ShieldAlert className="mr-1.5 h-4 w-4" />
            {missing ? "Kayboldu Bildirildi" : "Kayboldu — Bildir"}
          </Button>
          <Button variant="outline" onClick={callCaregiver}>
            <Phone className="mr-1.5 h-4 w-4" />
            Bakım Vereni Ara
          </Button>
        </div>

        {missing && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-rose-500/15 px-3 py-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-rose-400" />
            <span className="text-xs font-semibold text-rose-300">
              {profile.caregiverName}'ye kaybolma bildirimi gönderildi. Son görülme: az önce.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
