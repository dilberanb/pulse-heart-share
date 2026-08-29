import { useEffect, useMemo, useRef, useState } from "react";
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
  Volume2,
  Share2,
  Navigation,
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
import {
  speakTurkish,
  stopSpeaking,
  primeTurkishVoices,
  haversineMeters,
  bearingDegrees,
} from "@/features/memory/lib/tts";

const CATEGORY_META: Record<
  ReminderTask["category"],
  { icon: typeof Pill; color: string }
> = {
  medication: { icon: Pill, color: "text-rose-400" },
  water: { icon: Droplets, color: "text-sky-400" },
  food: { icon: Utensils, color: "text-amber-400" },
  activity: { icon: Footprints, color: "text-emerald-400" },
};

/** En son konuşulan sesin adı (UI'da gösterim). */
let lastVoiceName = "";
export function usedVoiceName(): string {
  return lastVoiceName;
}

export function MemoryMode() {
  const profile = MOCK_MEMORY_PROFILE;
  const [reminders, setReminders] = useState<ReminderTask[]>(MOCK_REMINDERS);
  const [missing, setMissing] = useState(false);
  const [detectedInside, setDetectedInside] = useState<boolean | null>(null);
  const [current, setCurrent] = useState<{ lat: number; lng: number } | null>(
    null,
  );

  // Sesli navigasyon durumu
  const [navigating, setNavigating] = useState(false);
  const [navMessage, setNavMessage] = useState<string>("");
  const [navDistance, setNavDistance] = useState<number | null>(null);
  const [navHeading, setNavHeading] = useState<number | null>(null);
  const [navShared, setNavShared] = useState(false);
  const watchRef = useRef<number | null>(null);
  const lastSpokenDist = useRef<number>(-1);

  // Canlı konum paylaşımı
  const [liveSharing, setLiveSharing] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(
    null,
  );

  const dateLine = useMemo(() => todayTurkish(), []);
  const time = useMemo(() => nowTurkish(), []);

  useEffect(() => {
    primeTurkishVoices();
    void voiceStatusCheck();
    return () => {
      if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
      stopSpeaking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function voiceStatusCheck() {
    // Sesler bazen asenkron yüklenir; birkaç deneme yap
    for (let i = 0; i < 10; i++) {
      speakTurkish(""); // kullanıcıya sessizce ses motorunu yükle
      await new Promise((r) => setTimeout(r, 100));
    }
    stopSpeaking();
  }

  /** Kimlik kartı — doğal Türkçe sesle okur */
  const remindIdentity = () => {
    const daughter = profile.familyFacts[0]?.value ?? "";
    const son = profile.familyFacts[1]?.value ?? "";
    const text = `Benim adım ${profile.name}. Kızım ${daughter}, oğlum ${son}. Evim ${profile.address} adresinde.`;
    speakTurkish(text, { rate: 0.85 });
    lastVoiceName = "";
    setFeedback({ ok: true, text: "Kimlik kartı sesli okundu (doğal Türkçe ses)." });
  };

  const toggleReminder = (id: string) => {
    setReminders((rs) =>
      rs.map((r) => (r.id === id ? { ...r, done: !r.done } : r)),
    );
    const r = reminders.find((x) => x.id === id);
    if (r && !r.done) {
      speakTurkish(`${r.title} zamanı geldi.`, { rate: 0.9 });
    }
  };

  /** Güvenli bölge kontrolü */
  const checkSafeZone = () => {
    if (!navigator.geolocation) {
      setFeedback({ ok: false, text: "Tarayıcı konum desteklemiyor." });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const d = haversineMeters(
          latitude,
          longitude,
          profile.homeGeocode.lat,
          profile.homeGeocode.lng,
        );
        setCurrent({ lat: latitude, lng: longitude });
        const inside = d < profile.safeZoneRadiusMeters;
        setDetectedInside(inside);
        if (!inside) setMissing(true);
        setFeedback({
          ok: true,
          text: inside
            ? `Güvenli bölgenin içindesin (eve ${Math.round(d)} m).`
            : `Evden ${Math.round(d)} m uzaktasın — güvenli bölgenin dışındasın!`,
        });
      },
      () =>
        setFeedback({ ok: false, text: "Konum alınamadı. Lütfen izni kontrol et." }),
    );
  };

  const startMissingAlert = () => {
    setMissing(true);
    setFeedback({ ok: true, text: `Kaybolma bildirimi ${profile.caregiverName}'ye gönderildi.` });
  };

  const callCaregiver = () => {
    window.open(`tel:${profile.caregiverPhone.replace("+", "")}`, "_self");
  };

  /** Canlı konum paylaşımı — bakım verene link gösterir ve günceller */
  const shareLiveLocation = () => {
    if (!navigator.geolocation) {
      setFeedback({ ok: false, text: "Tarayıcı konum desteklemiyor." });
      return;
    }
    if (liveSharing) {
      if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
      watchRef.current = null;
      setLiveSharing(false);
      setNavShared(false);
      stopSpeaking();
      setFeedback({ ok: true, text: "Canlı konum paylaşımı durduruldu." });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLiveSharing(true);
        setNavShared(true);
        setFeedback({
          ok: true,
          text: `Canlı konum paylaşılıyor → ${profile.caregiverName}. Link: maps.google.com/?q=${latitude.toFixed(5)},${longitude.toFixed(5)}`,
        });
        speakTurkish(
          `Canlı konumunuz ${profile.caregiverName} ile paylaşılıyor.`,
          { rate: 0.9 },
        );
        // Watch ile sürekli güncelle
        watchRef.current = navigator.geolocation.watchPosition(
          (p) => {
            setCurrent({ lat: p.coords.latitude, lng: p.coords.longitude });
          },
          () => {},
          { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
        );
      },
      () => setFeedback({ ok: false, text: "Konum izni verilmedi." }),
    );
  };

  /** "Beni Eve Götür" — sesli + metin navigasyon akışı başlatır */
  const startNavigation = () => {
    stopSpeaking();
    if (!navigator.geolocation) {
      setFeedback({ ok: false, text: "Tarayıcı konum desteklemiyor." });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const d = haversineMeters(
          latitude,
          longitude,
          profile.homeGeocode.lat,
          profile.homeGeocode.lng,
        );
        const heading = bearingDegrees(
          latitude,
          longitude,
          profile.homeGeocode.lat,
          profile.homeGeocode.lng,
        );
        setCurrent({ lat: latitude, lng: longitude });
        startNavLoop(latitude, longitude, d, heading);
      },
      () => setFeedback({ ok: false, text: "Konum alınamadı — lütfen izni kontrol et." }),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  function startNavLoop(
    lat: number,
    lng: number,
    initialDist: number,
    initialHeading: number,
  ) {
    setNavigating(true);
    setNavDistance(initialDist);
    setNavHeading(initialHeading);
    lastSpokenDist.current = -1;
    const intro = `Sakin ol, şimdi eve gidiyoruz.`;
    setNavMessage(intro);
    // Sesli başlangıç; kısa bir gecikmeyle ilk yön
    speakTurkish(intro, { rate: 0.85 });
    setTimeout(() => {
      const msg = navigationMessage(initialDist, initialHeading);
      setNavMessage(msg);
      speakTurkish(msg, { rate: 0.85 });
    }, 3500);

    // Konum değiştikçe mesajı güncelle
    watchRef.current = navigator.geolocation.watchPosition(
      (p) => {
        const d = haversineMeters(
          p.coords.latitude,
          p.coords.longitude,
          profile.homeGeocode.lat,
          profile.homeGeocode.lng,
        );
        const heading = bearingDegrees(
          p.coords.latitude,
          p.coords.longitude,
          profile.homeGeocode.lat,
          profile.homeGeocode.lng,
        );
        setCurrent({ lat: p.coords.latitude, lng: p.coords.longitude });
        setNavDistance(d);
        setNavHeading(heading);

        const msg = navigationMessage(d, heading);
        setNavMessage(msg);

        // Mesafe eşiği aşılınca tekrar sesli uyar
        const bucket = Math.floor(d / 100);
        if (bucket !== lastSpokenDist.current) {
          lastSpokenDist.current = bucket;
          speakTurkish(msg, { rate: 0.85 });
        }

        if (d <= 30) {
          stopSpeaking();
          const arrived = "Eve ulaştın. İyi ki geldin, güvendesin.";
          setNavMessage(arrived);
          speakTurkish(arrived, { rate: 0.85 });
          stopNavigation();
        }
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
    );
  }

  /** Mesafeye ve yöne göre sade, anlaşılır bir yol talimatı üretir. */
  function navigationMessage(distance: number, heading: number): string {
    if (distance <= 30) return "Eve ulaştın. Güvendesin.";
    const km = distance >= 1000;
    const distStr = km
      ? `${(distance / 1000).toFixed(1)} kilometre`
      : `${Math.round(distance)} metre`;

    // Yön — kuzeye/sağa/sola gibi basit, anlaşılır ifadeler
    let direction: string;
    if (heading < 22.5 || heading >= 337.5) direction = "düz kuzeye";
    else if (heading < 67.5) direction = "sağa doğru ilerle";
    else if (heading < 112.5) direction = "düz doğuya";
    else if (heading < 157.5) direction = "sağ tarafa yönel";
    else if (heading < 202.5) direction = "arkana dön, güneye git";
    else if (heading < 247.5) direction = "sol tarafa yönel";
    else if (heading < 292.5) direction = "düz batıya";
    else direction = "soluna dön";

    return `Önündeki ${distStr} kadar ${direction}. Sokak sonunda yön değiştiriyoruz.`;
  }

  const stopNavigation = () => {
    setNavigating(false);
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    watchRef.current = null;
    stopSpeaking();
    setNavMessage("");
    setNavDistance(null);
    setNavHeading(null);
  };

  const openMapRoute = () => {
    if (current) {
      window.open(
        `https://www.google.com/maps/dir/${current.lat},${current.lng}/${profile.homeGeocode.lat},${profile.homeGeocode.lng}`,
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
              <p className="text-sm text-muted-foreground">Düzce</p>
              <p className="mt-1 text-xs text-muted-foreground">Evim: {profile.address}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={remindIdentity} className="shrink-0">
            <Bell className="mr-1.5 h-4 w-4" />
            Sesli Hatırlat
          </Button>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {profile.familyFacts.map((f) => (
            <div key={f.label} className="rounded-lg bg-muted/40 px-3 py-2 text-center">
              <span className="block text-[11px] text-muted-foreground">{f.label}</span>
              <span className="block text-sm font-bold text-foreground">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Geri bildirim / ses motoru bilgisi */}
      {feedback && (
        <div
          className={cn(
            "rounded-xl px-4 py-3 text-xs leading-relaxed",
            feedback.ok
              ? "bg-emerald-500/10 text-emerald-300"
              : "bg-rose-500/10 text-rose-300",
          )}
        >
          {feedback.text}
        </div>
      )}

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
                <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted/60", meta.color)}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="flex-1">
                  <span className={cn("block text-sm font-semibold text-foreground", r.done && "line-through")}>
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

      {/* Beni Eve Götür — belirgin, tek tık navigasyon */}
      <div className="rounded-2xl border-2 border-primary bg-card p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Home className="h-6 w-6" />
            </span>
            <div>
              <h3 className="text-base font-black text-foreground">Beni Eve Götür</h3>
              <p className="text-xs text-muted-foreground">
                Sesli + metin yönlendirmeli, adım adım evine götürür.
              </p>
            </div>
          </div>
          <Volume2 className="h-5 w-5 text-primary" />
        </div>

        {/* Aktif navigasyon paneli */}
        {navigating ? (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3">
              <Navigation className="h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm font-semibold leading-relaxed text-foreground">
                {navMessage}
              </p>
            </div>
            {navDistance !== null && (
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Eve {navDistance >= 1000 ? `${(navDistance / 1000).toFixed(1)} km` : `${Math.round(navDistance)} m`}
                </span>
                <button type="button" className="font-semibold text-primary" onClick={stopNavigation}>
                  Durdur
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button onClick={startNavigation} className="h-14 w-full text-base">
              <Home className="mr-2 h-5 w-5" />
              Yönlendirmeyi Başlat
            </Button>
            <Button variant="outline" onClick={openMapRoute} className="h-14 w-full text-base">
              <MapPin className="mr-2 h-5 w-5" />
              Haritada Gör
            </Button>
          </div>
        )}
      </div>

      {/* Bakım verenle canlı konum paylaşımı */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue-500/10">
            <Share2 className="h-4 w-4 text-blue-400" />
          </span>
          <h3 className="text-sm font-bold text-foreground">Bakım Verenle Canlı Konum</h3>
        </div>
        <p className="mb-3 text-xs text-muted-foreground">
          {profile.name} için canlı konum, {profile.caregiverName} ({profile.caregiverPhone}) ile paylaşılsın.
        </p>
        <Button
          variant={liveSharing ? "destructive" : "outline"}
          onClick={shareLiveLocation}
          className="w-full"
        >
          <Share2 className="mr-1.5 h-4 w-4" />
          {liveSharing ? "Canlı Paylaşımı Durdur" : "Canlı Konumu Paylaş"}
        </Button>
        {liveSharing && (
          <p className="mt-2 flex items-center gap-2 text-xs text-blue-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-blue-400" />
            Canlı paylaşım aktif — konum sürekli güncelleniyor.
          </p>
        )}
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
          {profile.name} evden {profile.safeZoneRadiusMeters} metre uzaklaşırsa bakım verene otomatik bildirim gider.
        </p>

        <Button variant="outline" onClick={checkSafeZone} className="w-full">
          <MapPin className="mr-1.5 h-4 w-4" />
          Konumu Kontrol Et
        </Button>

        {detectedInside !== null && (
          <p className={cn("mt-3 text-xs", detectedInside ? "text-emerald-400" : "text-rose-400")}>
            {detectedInside ? "Kişi güvenli bölgenin içinde. ✓" : "Dikkat: Kişi güvenli bölgenin dışında!"}
          </p>
        )}

        <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-500/10 px-3 py-2">
          <ShieldAlert className="h-5 w-5 shrink-0 text-rose-400" />
          <span className="text-xs text-rose-300">
            Kaybolma riskinde «Kayboldu — Bildir» ile bakım veren ({profile.caregiverName}) hemen aranır.
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
