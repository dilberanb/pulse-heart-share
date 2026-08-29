import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BellRing, CheckCircle2, Clock, HeartHandshake } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { usePublishStatus } from "@/features/status/hooks/useStatusFeed";

const STORAGE_KEY = "nabiz-daily-checkin";

interface StoredCheckIn {
  hour: number;
  minute: number;
  /** Bugünün "YYYY-MM-DD" değeri onaylandığında kaydedilir. */
  lastConfirmedDay: string | null;
  /** Onayı kaç kez kaçırdığı (arka arkaya günler). */
  missedStreak: number;
}

function load(): StoredCheckIn {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { hour: 9, minute: 0, lastConfirmedDay: null, missedStreak: 0, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return { hour: 9, minute: 0, lastConfirmedDay: null, missedStreak: 0 };
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Düzenli check-in — "her gün iyi olduğunu bildir, unutursan aile uyarılır."
 * Yaşlı / bakım gerektiren profiller için yaşamsal bir güvence.
 * MVP: yerel zamanlayıcı + bildirim simülasyonu; gerçekte zamanlanmış push bildirimi.
 */
export function DailyCheckIn() {
  const [config, setConfig] = useState<StoredCheckIn>(() => load());
  const [now, setNow] = useState(() => new Date());
  const publish = usePublishStatus();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config]);

  // Dakikada bir saati tazele.
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const checkTime = useMemo(() => {
    const d = new Date();
    d.setHours(config.hour, config.minute, 0, 0);
    return d;
  }, [config.hour, config.minute]);

  const dueToday = now >= checkTime;
  const alreadyConfirmedToday = config.lastConfirmedDay === todayKey();
  const needsConfirmation = dueToday && !alreadyConfirmedToday;

  function confirmOk() {
    setConfig((c) => ({ ...c, lastConfirmedDay: todayKey(), missedStreak: 0 }));
    publish.mutate({ statusId: "elsafe", privacy: "inner" });
  }

  function simulateNotifyFamily() {
    toast.info("Ailene otomatik hatırlatma gönderildi — henüz 'iyiyim' onayı yok.");
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10">
            {alreadyConfirmedToday && !needsConfirmation ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            ) : (
              <HeartHandshake className="h-5 w-5 text-emerald-400" />
            )}
          </span>
          <div>
            <h3 className="text-sm font-bold text-foreground">Günlük İyiyim Kontrolü</h3>
            <p className="text-xs text-muted-foreground">
              Her gün {String(config.hour).padStart(2, "0")}:{String(config.minute).padStart(2, "0")}'te kendini iyi hissettiğini bildir.
            </p>
          </div>
        </div>
        <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <select
            value={config.hour}
            onChange={(e) =>
              setConfig((c) => ({ ...c, hour: Number(e.target.value) }))
            }
            className="rounded-md border border-border bg-background px-1 py-0.5 text-xs"
            aria-label="Check-in saati (saat)"
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {String(i).padStart(2, "0")}
              </option>
            ))}
          </select>
          <span>:</span>
          <select
            value={config.minute}
            onChange={(e) =>
              setConfig((c) => ({ ...c, minute: Number(e.target.value) }))
            }
            className="rounded-md border border-border bg-background px-1 py-0.5 text-xs"
            aria-label="Check-in saati (dakika)"
          >
            {[0, 15, 30, 45].map((m) => (
              <option key={m} value={m}>
                {String(m).padStart(2, "0")}
              </option>
            ))}
          </select>
        </label>
      </div>

      <AnimatePresence>
        {needsConfirmation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-xl border-2 border-emerald-400/30 bg-emerald-500/5 p-3">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <BellRing className="h-4 w-4 text-emerald-400" />
                Bugünün kontrolü hazır — İyiyim mi?
              </p>
              <div className="mt-2 flex gap-2">
                <Button onClick={confirmOk} className="h-11 flex-1">
                  <CheckCircle2 className="mr-1.5 h-4 w-4" />
                  İyiyim
                </Button>
                <Button variant="outline" onClick={simulateNotifyFamily} className="h-11">
                  Ailemi hatırlat
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {alreadyConfirmedToday && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-sm text-emerald-500"
          >
            Bugün için teşekkürler — ailene güvende olduğunu bildirdin.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
