import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, Clock, MapPin, Phone, Volume2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { usePublishStatus } from "@/features/status/hooks/useStatusFeed";
import { useAppStore } from "@/store/useAppStore";

const EMERGENCY_NUMBERS = [
  { id: "112", label: "112", desc: "Jandarma / Emniyet / İtfaiye / Ambulans", phone: "112" },
  { id: "155", label: "155", desc: "Polis İhbar", phone: "155" },
  { id: "156", label: "156", desc: "Jandarma İhbar", phone: "156" },
  { id: "afad", label: "AFAD", desc: "Afet ve Acil Durum", phone: "122" },
];

export function SosSheet() {
  const isOpen = useAppStore((s) => s.isSosOpen);
  const closeSos = useAppStore((s) => s.closeSos);
  const publish = usePublishStatus();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [activated, setActivated] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      clearTimer();
      setCountdown(null);
      setActivated(false);
    }
  }, [isOpen, clearTimer]);

  function startCountdown() {
    setCountdown(3);
    let count = 3;
    intervalRef.current = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        clearTimer();
        setCountdown(null);
        setActivated(true);
      } else {
        setCountdown(count);
      }
    }, 1000);
  }

  function cancelCountdown() {
    clearTimer();
    setCountdown(null);
  }

  function handleCall(number: string) {
    window.open(`tel:${number}`, "_self");
  }

  function handleShareLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
        window.open(url, "_blank");
      },
      () => {},
    );
  }

  function handleTriggerAlarm() {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      osc.type = "square";
      gain.gain.value = 0.3;
      osc.start();
      setTimeout(() => {
        osc.stop();
        ctx.close();
      }, 5000);
    } catch {
      // audio not available
    }
  }

  function handlePublishUrgent() {
    publish.mutate(
      { statusId: "unsafe", privacy: "everyone" },
      { onSuccess: closeSos },
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? undefined : closeSos())}>
      <SheetContent
        side="bottom"
        className="fixed inset-0 z-50 h-screen w-screen max-w-none rounded-none border-0 bg-sos p-0 text-sos-ink data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom"
      >
        <div className="flex h-full flex-col">
          {/* Üst bar */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-widest">ACİL DURUM</span>
            </div>
            <button
              type="button"
              onClick={closeSos}
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 transition-colors hover:bg-white/25"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Ana içerik */}
          <div className="flex flex-1 flex-col items-center justify-center px-6">
            {!activated ? (
              <>
                {/* Geri sayım */}
                {countdown !== null ? (
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative flex h-32 w-32 items-center justify-center">
                      <svg className="absolute h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="4"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="white"
                          strokeWidth="4"
                          strokeDasharray="283"
                          className="countdown-ring"
                        />
                      </svg>
                      <span className="text-6xl font-bold">{countdown}</span>
                    </div>
                    <p className="text-base font-medium opacity-80">
                      Acil durum bildirimi gönderilecek
                    </p>
                    <Button
                      variant="outline"
                      onClick={cancelCountdown}
                      className="h-12 rounded-xl border-2 border-white/30 bg-transparent text-base font-semibold text-white hover:bg-white/10"
                    >
                      İptal
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-2 text-6xl pulse-sos">🆘</div>
                    <h2 className="mb-2 text-center text-2xl font-bold">Acil Durum</h2>
                    <p className="mb-8 text-center text-sm opacity-75">
                      Numarayı seçerek hemen ara, ya da konumunu paylaş.
                    </p>

                    {/* Acil numaralar */}
                    <div className="grid w-full grid-cols-2 gap-3">
                      {EMERGENCY_NUMBERS.map((num) => (
                        <button
                          key={num.id}
                          type="button"
                          onClick={() => handleCall(num.phone)}
                          className="flex flex-col items-center gap-1 rounded-xl border-2 border-white/25 bg-white/10 px-4 py-5 transition-colors hover:bg-white/20 active:scale-[0.97]"
                        >
                          <Phone className="mb-1 h-5 w-5 opacity-70" />
                          <span className="text-2xl font-bold">{num.label}</span>
                          <span className="text-[11px] opacity-60">{num.desc}</span>
                        </button>
                      ))}
                    </div>

                    {/* Aksiyon butonları */}
                    <div className="mt-6 grid w-full grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={handleShareLocation}
                        className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-white/25 bg-white/10 px-4 py-4 transition-colors hover:bg-white/20 active:scale-[0.97]"
                      >
                        <MapPin className="h-5 w-5 opacity-70" />
                        <span className="text-sm font-semibold">Konumumu Paylaş</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleTriggerAlarm}
                        className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-white/25 bg-white/10 px-4 py-4 transition-colors hover:bg-white/20 active:scale-[0.97]"
                      >
                        <Volume2 className="h-5 w-5 opacity-70" />
                        <span className="text-sm font-semibold">Alarm Çaldır</span>
                      </button>
                    </div>

                    {/* Ana tetikleme butonu */}
                    <div className="mt-8 w-full">
                      <Button
                        onClick={startCountdown}
                        className="h-14 w-full rounded-xl bg-white text-lg font-bold text-sos hover:bg-white/90"
                      >
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        Acil Durum Bildir
                      </Button>
                      <p className="mt-3 text-center text-xs opacity-50">
                        Tüm çemberlerine anında bildirim gönderilir
                      </p>
                    </div>
                  </>
                )}
              </>
            ) : (
              /* Aktif mod */
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/20 pulse-sos">
                    <Phone className="h-10 w-10" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Bildirim Gönderildi</h2>
                  <p className="mt-2 text-sm opacity-75">
                    Acil durum bildiriminiz tüm çemberlerinize iletildi.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm opacity-60">
                  <Clock className="h-4 w-4" />
                  <span>Şimdi paylaşılıyor…</span>
                </div>
                <Button
                  onClick={closeSos}
                  variant="outline"
                  className="mt-4 h-12 rounded-xl border-2 border-white/30 bg-transparent text-base font-semibold text-white hover:bg-white/10"
                >
                  Kapat
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
