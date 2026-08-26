import { useEffect, useCallback } from "react";
import { X, MapPin, Vibrate, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEmergency } from "@/features/emergency/hooks/useEmergency";
import { PRIMARY_EMERGENCY_NUMBERS } from "@/features/emergency/data/emergencyNumbers";
import { triggerVibration } from "@/lib/location";

interface EmergencyPanelProps {
  open: boolean;
  onClose: () => void;
}

export function EmergencyPanel({ open, onClose }: EmergencyPanelProps) {
  const {
    alert,
    location,
    locationError,
    isActive,
    isCountdown,
    triggerEmergency,
    cancelEmergency,
    shareLocationNow,
    resetAlert,
  } = useEmergency();

  const countdownSec = alert ? Math.ceil(alert.countdownMs / 1000) : 3;

  const handleClose = useCallback(() => {
    if (isActive) return; // aktif alarmda kapatmaya izin verme
    resetAlert();
    onClose();
  }, [isActive, resetAlert, onClose]);

  // ESC tuşu ile kapatma
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, handleClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-y-auto bg-red-600 text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Acil durum paneli"
    >
      {/* Üst bar */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-4 pt-4">
        <h1 className="text-xl font-bold tracking-tight">ACİL DURUM</h1>
        {!isActive && (
          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Geri sayım */}
      {isCountdown && (
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="relative flex h-28 w-28 items-center justify-center">
            <svg className="absolute inset-0 h-full w-full -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="50"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="6"
              />
              <circle
                cx="56"
                cy="56"
                r="50"
                fill="none"
                stroke="white"
                strokeWidth="6"
                strokeDasharray={314}
                strokeDashoffset={314 * (1 - alert.countdownMs / 3000)}
                strokeLinecap="round"
                className="transition-all duration-100"
              />
            </svg>
            <span className="text-4xl font-black tabular-nums">{countdownSec}</span>
          </div>
          <p className="text-sm text-white/80">Acil durum aktifleşecek…</p>
          <Button
            onClick={cancelEmergency}
            className="mt-2 h-14 w-48 rounded-2xl bg-white text-lg font-bold text-red-600 hover:bg-white/90"
          >
            İptal Et
          </Button>
        </div>
      )}

      {/* Aktif alarm durumu */}
      {isActive && (
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 animate-pulse">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <p className="text-lg font-semibold">Acil durum aktif</p>
          {location && (
            <p className="max-w-xs text-center text-sm text-white/70">
              Konumunuz paylaşılıyor: {location.latitude.toFixed(4)},{" "}
              {location.longitude.toFixed(4)}
            </p>
          )}
          <Button
            onClick={cancelEmergency}
            className="mt-2 h-14 w-48 rounded-2xl bg-white text-lg font-bold text-red-600 hover:bg-white/90"
          >
            Ben Güvendeyim
          </Button>
        </div>
      )}

      {/* Acil durum butonları — sadece idle durumda */}
      {!alert && (
        <div className="grid w-full max-w-sm grid-cols-2 gap-3 px-4">
          {PRIMARY_EMERGENCY_NUMBERS.map((num) => {
            const Icon = num.icon;
            return (
              <a
                key={num.id}
                href={num.telHref}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-3xl bg-white/15 p-5 text-center",
                  "transition-colors active:bg-white/25",
                )}
                onClick={(e) => {
                  // Geri sayımı tetikle, arama yine de başlasın
                  if (!alert) triggerEmergency(num.id);
                }}
              >
                <Icon className="h-8 w-8" />
                <span className="text-2xl font-black">{num.phone}</span>
                <span className="text-xs text-white/70">{num.name}</span>
              </a>
            );
          })}
        </div>
      )}

      {/* Alt aksiyonlar */}
      {!alert && (
        <div className="mt-6 flex w-full max-w-sm flex-col gap-3 px-4 pb-8">
          <button
            type="button"
            onClick={() => void shareLocationNow()}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-white/40 bg-white/10 py-4 text-base font-semibold transition-colors active:bg-white/20"
          >
            <MapPin className="h-5 w-5" />
            Konumumu Paylaş
          </button>
          <button
            type="button"
            onClick={() => triggerVibration()}
            className="flex items-center justify-center gap-2 rounded-2xl border-2 border-white/40 bg-white/10 py-4 text-base font-semibold transition-colors active:bg-white/20"
          >
            <Vibrate className="h-5 w-5" />
            Alarm Çaldır
          </button>
          {locationError && (
            <p className="text-center text-xs text-white/50">{locationError}</p>
          )}
        </div>
      )}
    </div>
  );
}
