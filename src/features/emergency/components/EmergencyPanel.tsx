import { useEffect, useCallback, useState } from "react";
import {
  X,
  MapPin,
  Vibrate,
  ShieldCheck,
  Phone,
  ChevronRight,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEmergency } from "@/features/emergency/hooks/useEmergency";
import { PRIMARY_EMERGENCY_NUMBERS } from "@/features/emergency/data/emergencyNumbers";
import { triggerVibration } from "@/lib/location";

interface EmergencyPanelProps {
  open: boolean;
  onClose: () => void;
}

interface FamilyMember {
  id: string;
  name: string;
  phone: string;
  priority: number;
  relation: string;
}

const MOCK_FAMILY: FamilyMember[] = [
  { id: "fam-1", name: "Baba Mehmet", phone: "+905321112233", priority: 1, relation: "Baba" },
  { id: "fam-2", name: "Anne Ayşe", phone: "+905324445566", priority: 2, relation: "Anne" },
  { id: "fam-3", name: "Kardeş Elif", phone: "+905327778899", priority: 3, relation: "Kardeş" },
];

const PRIORITY_LABELS: Record<number, string> = {
  1: "1. Sıra",
  2: "2. Sıra",
  3: "3. Sıra",
};

const PRIORITY_COLORS: Record<number, string> = {
  1: "bg-red-500/20 text-red-300",
  2: "bg-amber-500/20 text-amber-300",
  3: "bg-blue-500/20 text-blue-300",
};

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

  const [familyCallPrompt, setFamilyCallPrompt] = useState<FamilyMember | null>(null);
  const [familyCallIndex, setFamilyCallIndex] = useState(0);

  const countdownSec = alert ? Math.ceil(alert.countdownMs / 1000) : 3;

  const handleClose = useCallback(() => {
    if (isActive) return;
    resetAlert();
    onClose();
  }, [isActive, resetAlert, onClose]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, handleClose]);

  useEffect(() => {
    if (!open) {
      setFamilyCallPrompt(null);
      setFamilyCallIndex(0);
    }
  }, [open]);

  if (!open) return null;

  function handleFamilyCall(member: FamilyMember) {
    setFamilyCallPrompt(member);
  }

  function confirmFamilyCall() {
    if (familyCallPrompt) {
      window.open(`tel:${familyCallPrompt.phone}`, "_self");
      setFamilyCallPrompt(null);
    }
  }

  function handleFamilyCallNext() {
    const nextIndex = familyCallIndex + 1;
    if (nextIndex < MOCK_FAMILY.length && MOCK_FAMILY[nextIndex]) {
      setFamilyCallIndex(nextIndex);
      setFamilyCallPrompt(MOCK_FAMILY[nextIndex]!);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center overflow-y-auto bg-red-600 text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Acil durum paneli"
    >
      {/* Üst bar */}
      <div className="sticky inset-x-0 top-0 z-10 flex w-full items-center justify-between bg-red-700/80 px-4 py-4 backdrop-blur-sm">
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

      <div className="w-full max-w-lg space-y-6 px-4 pt-4 pb-8">
        {/* Geri sayım */}
        {isCountdown && (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="relative flex h-28 w-28 items-center justify-center">
              <svg className="absolute inset-0 h-full w-full -rotate-90">
                <circle cx="56" cy="56" r="50" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="6" />
                <circle
                  cx="56"
                  cy="56"
                  r="50"
                  fill="none"
                  stroke="white"
                  strokeWidth="6"
                  strokeDasharray={314}
                  strokeDashoffset={314 * (1 - (alert?.countdownMs ?? 3000) / 3000)}
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
          <div className="flex flex-col items-center gap-4 py-8">
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

        {/* Family call confirmation */}
        {familyCallPrompt && (
          <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-white/20 bg-white/10 p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15">
              <Phone className="h-8 w-8" />
            </div>
            <p className="text-center text-lg font-bold">{familyCallPrompt.name} aranacak</p>
            <p className="text-sm text-white/60">{familyCallPrompt.phone}</p>
            <div className="flex w-full flex-col gap-2">
              <Button
                onClick={confirmFamilyCall}
                className="h-12 rounded-xl bg-white text-base font-bold text-red-600 hover:bg-white/90"
              >
                Ara
              </Button>
              {familyCallIndex < MOCK_FAMILY.length - 1 && (
                <Button
                  onClick={handleFamilyCallNext}
                  variant="outline"
                  className="h-12 rounded-xl border-white/30 bg-transparent text-base font-semibold text-white hover:bg-white/10"
                >
                  Sonrakini Dene ({MOCK_FAMILY[familyCallIndex + 1]?.name})
                </Button>
              )}
              <Button
                onClick={() => setFamilyCallPrompt(null)}
                variant="ghost"
                className="h-10 text-sm text-white/60 hover:text-white"
              >
                İptal
              </Button>
            </div>
          </div>
        )}

        {/* ACİL HATLAR */}
        {!alert && (
          <section className="space-y-3">
            <h2 className="text-base font-bold tracking-wide text-white/90">ACİL HATLAR</h2>
            <div className="grid w-full grid-cols-2 gap-3">
              {PRIMARY_EMERGENCY_NUMBERS.map((num) => {
                const Icon = num.icon;
                return (
                  <a
                    key={num.id}
                    href={num.telHref}
                    onClick={() => {
                      if (!alert) triggerEmergency(num.id);
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-3xl bg-white/15 p-5 text-center",
                      "transition-colors active:bg-white/25",
                    )}
                  >
                    <Icon className="h-8 w-8" />
                    <span className="text-2xl font-black">{num.phone}</span>
                    <span className="text-xs text-white/70">{num.name}</span>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* AİLEM */}
        {!alert && (
          <section className="space-y-3">
            <h2 className="text-base font-bold tracking-wide text-white/90">AİLEM</h2>
            <p className="text-xs text-white/50">
              İlk kişiyi aramaya çalışın, cevap almazsanız sıradakine geçin.
            </p>
            <div className="space-y-2">
              {MOCK_FAMILY.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => handleFamilyCall(member)}
                  className="flex w-full items-center gap-4 rounded-2xl bg-white/10 p-4 text-left transition-colors active:bg-white/20"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                    <User className="h-6 w-6" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{member.name}</p>
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold", PRIORITY_COLORS[member.priority])}>
                        {PRIORITY_LABELS[member.priority]}
                      </span>
                    </div>
                    <p className="text-xs text-white/50">{member.phone}</p>
                  </div>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                    <Phone className="h-5 w-5" />
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* EYLEMLER */}
        {!alert && (
          <section className="space-y-3">
            <h2 className="text-base font-bold tracking-wide text-white/90">EYLEMLER</h2>
            <div className="flex flex-col gap-3">
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
              {isActive && (
                <Button
                  onClick={cancelEmergency}
                  className="h-12 rounded-2xl bg-white text-base font-bold text-red-600 hover:bg-white/90"
                >
                  <ShieldCheck className="h-5 w-5" />
                  Ben Güvendeyim
                </Button>
              )}
              {locationError && (
                <p className="text-center text-xs text-white/50">{locationError}</p>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
