import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Route,
  Clock,
  Share2,
  MapPin,
  ShieldCheck,
  Users,
  Phone,
  Bell,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GuardContact {
  id: string;
  name: string;
  phone: string;
  relation: string;
  selected?: boolean;
}

const DEFAULT_CONTACTS: GuardContact[] = [
  { id: "c1", name: "Ayşe (Annem)", phone: "+905321234567", relation: "Anne" },
  { id: "c2", name: "Elif (Kardeşim)", phone: "+905327778899", relation: "Kardeş" },
  { id: "c3", name: "Barış (Arkadaşım)", phone: "+905325556677", relation: "Yakın arkadaş" },
];

const DURATIONS_MIN = [15, 30, 60, 120];

/**
 * Güvenli Yol Arkadaşı — gece eve dönen / güvenlik kaygısı olanlar için.
 * Manuel başlatır, belirlediği kişilerle sınırlı süreli canlı konum paylaşır.
 * (Web vasıtasıyla simüle edilir; gerçek uçtan uca için Supabase realtime + mağaza bildirimi gerekir.)
 */
export function SafeCompanion() {
  const [active, setActive] = useState(false);
  const [contacts, setContacts] = useState<GuardContact[]>(DEFAULT_CONTACTS);
  const [durationMin, setDurationMin] = useState(30);
  const [elapsedMin, setElapsedMin] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  const [current, setCurrent] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const watchRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [welcome, setWelcome] = useState<string | null>(null);
  const [parting, setParting] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const toggleContact = (id: string) => {
    setContacts((cur) =>
      cur.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c)),
    );
  };

  const selectedCount = contacts.filter((c) => (c as GuardContact & { selected?: boolean }).selected).length;

  const start = () => {
    if (!navigator.geolocation) {
      setLastUpdate("Tarayıcı konum desteklemiyor.");
      return;
    }
    setActive(true);
    setElapsedMin(0);
    setLastUpdate(null);
    const selected = contacts.filter((c) => (c as GuardContact & { selected?: boolean }).selected);
    const names = selected.map((c) => c.name.split(" (")[0]).join(", ");
    setParting(null);
    setWelcome("Başlatılıyor… Güvenli yolculuklar dileriz.");
    setTimeout(() => setWelcome(null), 3200);
    if (selected.length > 0) {
      setLastUpdate(
        `Canlı konum paylaşılıyor → ${selected.map((c) => c.name.split(" (")[0]).join(", ")} (${durationMin} dk).`,
      );
    } else {
      setLastUpdate(`Canlı konum hazır. Paylaşılacak kişi seç.`);
    }

    // Canlı konum izleme
    navigator.geolocation.getCurrentPosition((pos) => {
      setCurrent({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    }, () => {});
    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setCurrent({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLastUpdate(
          `Konum güncellendi — maps.google.com/?q=${pos.coords.latitude.toFixed(5)},${pos.coords.longitude.toFixed(5)}`,
        );
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 },
    );

    // Süre sayacı
    timerRef.current = setInterval(() => {
      setElapsedMin((m) => {
        if (m + 1 >= durationMin) {
          finish("Süre doldu");
          return durationMin;
        }
        return m + 1;
      });
    }, 60000);
  };

  const finish = (reason: string) => {
    if (watchRef.current) navigator.geolocation.clearWatch(watchRef.current);
    watchRef.current = null;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    setActive(false);
    setWelcome(null);
    if (reason === "Süre doldu") {
      setLastUpdate("Süre doldu — paylaşım otomatik sonlandı. Artık kimse konumunu göremiyor.");
    } else if (reason === "varis") {
      setParting("Varışını bildirdin — paylaşım sona erdi. İyi geceler.");
      setTimeout(() => setParting(null), 3200);
      setLastUpdate("Varışı bildirdin — paylaşım sona erdi. Artık kimse konumunu göremiyor.");
    } else {
      setLastUpdate("Paylaşım durduruldu.");
    }
  };

  const shareCurrentMap = () => {
    if (current) {
      const text = `Konumum: https://www.google.com/maps?q=${current.lat},${current.lng}`;
      if (navigator.share) {
        void navigator.share({ text });
      } else {
        void navigator.clipboard?.writeText(text);
        setLastUpdate("Harita linki panoya kopyalandı.");
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Başlık */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-500/10">
            <Route className="h-5 w-5 text-violet-400" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-foreground">Güvenli Yol Arkadaşı</h3>
            <p className="text-xs text-muted-foreground">
              Gece eve dönerken ya da kaygılı olduğunda, güvendiğin kişilere sınırlı süreli canlı konum paylaş.
            </p>
          </div>
        </div>
      </div>

      {!active ? (
        <>
          {/* Kişi seçimi */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-bold text-foreground">Konumunu kimler görebilsin?</h4>
            </div>
            <div className="space-y-2">
              {contacts.map((c) => {
                const contact = c as GuardContact & { selected?: boolean };
                const sel = !!contact.selected;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleContact(c.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                      sel ? "bg-primary/10 ring-1 ring-primary/40" : "bg-muted/30 hover:bg-muted/50",
                    )}
                  >
                    <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full", sel ? "bg-primary text-primary-foreground" : "bg-muted/60 text-muted-foreground")}>
                      {c.name[0]}
                    </span>
                    <span className="flex-1">
                      <span className="block text-sm font-semibold text-foreground">{c.name}</span>
                      <span className="text-xs text-muted-foreground">{c.relation}</span>
                    </span>
                    <span className={cn("h-5 w-5 rounded-full border-2", sel ? "border-primary bg-primary" : "border-muted")} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Süre seçimi */}
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-bold text-foreground">Ne kadar süreyle paylaşılsın?</h4>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {DURATIONS_MIN.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDurationMin(d)}
                  className={cn(
                    "rounded-lg border px-2 py-2 text-center text-xs font-semibold transition-colors",
                    durationMin === d
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:bg-muted/30",
                  )}
                >
                  {d} dk
                </button>
              ))}
            </div>
          </div>

          {/* Başlat */}
          <Button
            onClick={start}
            disabled={selectedCount === 0}
            className="h-14 w-full text-base"
          >
            <ShieldCheck className="mr-2 h-5 w-5" />
            Konum Paylaşımını Başlat
          </Button>
          {selectedCount === 0 && (
            <p className="text-center text-xs text-muted-foreground">
              En az bir kişi seçmelisin.
            </p>
          )}
        </>
      ) : (
        <>
          {/* Aktif panel */}
          <div className="rounded-xl border-2 border-violet-400/40 bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-violet-300">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-violet-400" />
              Güvenli Yol Arkadaşı Aktif
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {selectedCount} kişi konumunu görebiliyor · {durationMin} dk planlandı
            </p>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-violet-500/10 px-3 py-2 text-xs text-violet-200">
              <Bell className="h-4 w-4 shrink-0" />
              Bildirim: "X varışına yaklaştı" mesajı seçili kişilere gönderiliyor.
            </div>
            {selectedCount > 0 && current && (
              <button
                type="button"
                onClick={shareCurrentMap}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-violet-400/30 px-3 py-2 text-xs font-semibold text-violet-200 hover:bg-violet-500/10"
              >
                <MapPin className="h-4 w-4" />
                Güncel Konumu Paylaş
              </button>
            )}
          </div>

          {/* Vardım / Durdur */}
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={() => finish("varis")} className="h-14 text-base">
              <ShieldCheck className="mr-2 h-5 w-5" />
              Güvenle Vardım
            </Button>
            <Button variant="outline" onClick={() => finish("durdur")} className="h-14 text-base">
              Durdur
            </Button>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            "Güvenle Vardım" → paylaşım sona erer, ailen "geldi" olarak görür.
          </p>
        </>
      )}

      {lastUpdate && (
        <div className="rounded-xl bg-muted/30 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          📍 {lastUpdate}
        </div>
      )}

      <AnimatePresence>
        {welcome && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="rounded-xl border border-violet-400/30 bg-violet-500/10 px-4 py-3 text-center"
          >
            <p className="text-sm font-semibold text-violet-200">{welcome}</p>
          </motion.div>
        )}
        {parting && (
          <motion.div
            key="parting"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="rounded-xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-center"
          >
            <p className="text-sm font-semibold text-emerald-200">{parting}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
