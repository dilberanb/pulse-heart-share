import { useEffect, useCallback, useState } from "react";
import {
  X,
  MapPin,
  Vibrate,
  ShieldCheck,
  Phone,
  Navigation,
  Siren,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEmergency } from "@/features/emergency/hooks/useEmergency";
import { useLongPressProps } from "@/hooks/useLongPress";
import { PRIMARY_EMERGENCY_NUMBERS, SUPPORT_EMERGENCY_NUMBERS } from "@/features/emergency/data/emergencyNumbers";
import { triggerVibration, getBestMapLink } from "@/lib/location";

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

  // UZUN BASMA ile 112'yi tetikle — yanlış alarmı önler
  const longPress = useLongPressProps({
    onTrigger: () => {
      triggerEmergency("112");
      // Tetiklemede titreşim
      triggerVibration([100, 100, 100]);
    },
    disabled: isActive || isCountdown,
  });

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

  function handleNavigateToLocation() {
    if (location) {
      window.open(getBestMapLink(location.latitude, location.longitude), "_blank");
    } else {
      void shareLocationNow();
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center overflow-y-auto bg-red-600 text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Acil durum paneli"
    >
      {/* Üst bar — sakin, kontrollü */}
      <div className="sticky inset-x-0 top-0 z-10 flex w-full items-center justify-between bg-red-700/80 px-4 py-4 backdrop-blur-sm">
        <h1 className="text-xl font-bold tracking-tight">GÜVENLİK MERKEZİ</h1>
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
        {/* ── DURUM: Hazırda / Itibar Modu ── */}
        {!alert && (
          <section className="space-y-3 text-center">
            {/* Kalkan animasyonu */}
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/15 animate-pulse">
                <ShieldCheck className="h-12 w-12" />
              </div>
              <div>
                <p className="text-xl font-bold">Her şey kontrol altında</p>
                <p className="mx-auto mt-1 max-w-xs text-sm text-white/70">
                  Acil bir durumda butonu <span className="font-semibold text-white">1.5 saniye basılı tut</span>.
                  Aile üyelerin ve acil servisler anında bilgilendirilir.
                </p>
              </div>
            </div>

            {/* Uzun basma ile SOS butonu */}
            <div {...longPress.pointerProps} className="select-none">
              <button
                type="button"
                className={cn(
                  "relative h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-red-500 text-white shadow-2xl",
                  "transition-transform active:scale-95",
                )}
                aria-label="Acil durum bildir (basılı tut)"
              >
                {/* Basılı tutma ilerleme dolgusu */}
                {longPress.isPressing && (
                  <span
                    className="absolute inset-0 bg-white/25"
                    style={{ clipPath: `circle(${longPress.progress * 100}% at 50% 50%)` }}
                  />
                )}
                <span className="relative flex flex-col items-center gap-1 font-black tracking-wide">
                  <Siren className="h-9 w-9" />
                  <span className="text-4xl">SOS</span>
                  <span className="text-[10px] font-semibold normal-case text-white/80">
                    {longPress.isPressing ? "Bırakma..." : "1.5 sn basılı tut"}
                  </span>
                </span>
              </button>
            </div>
            {longPress.isPressing && (
              <p className="text-xs text-white/70">
                {Math.round(longPress.progress * 100)}% — Acil durum gönderiliyor
              </p>
            )}
          </section>
        )}

        {/* ── DURUM: Geri Sayım (iptal edilebilir) ── */}
        {isCountdown && (
          <div className="flex flex-col items-center gap-3 py-8">
            <p className="text-lg font-semibold">Sakin ol, iptal edebilirsin</p>
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
            <p className="text-sm text-white/80">
              {countdownSec > 0 ? "Aile üyelerin bilgilendiriliyor…" : "Şimdi bilgilendiriliyorsun"}
            </p>
            <Button
              onClick={cancelEmergency}
              className="mt-2 h-14 w-56 rounded-2xl bg-white text-lg font-bold text-red-600 hover:bg-white/90"
            >
              İptal Et — Yanlışlıkla bastım
            </Button>
          </div>
        )}

        {/* ── DURUM: Aktif Alarm — Yönlendirme Adımları ── */}
        {isActive && (
          <section className="space-y-4">
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 animate-pulse">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <div>
                <p className="text-2xl font-bold">Sakin ol, yardım yolda</p>
                <p className="mt-1 text-sm text-white/80">
                  Aile üyelerin ve acil servisler bilgilendirildi. Yapabileceklerin:
                </p>
              </div>
            </div>

            {/* Yönlendirme adımları */}
            <div className="grid w-full grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => void shareLocationNow()}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white/15 p-4 active:bg-white/25"
              >
                <MapPin className="h-6 w-6" />
                <span className="text-sm font-semibold">Konumumu Paylaş</span>
                <span className="text-[10px] text-white/60">Aile, seni bulsun</span>
              </button>
              <button
                type="button"
                onClick={handleNavigateToLocation}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white/15 p-4 active:bg-white/25"
              >
                <Navigation className="h-6 w-6" />
                <span className="text-sm font-semibold">Rota Al</span>
                <span className="text-[10px] text-white/60">Konumuna navigasyon</span>
              </button>
              <a
                href="tel:112"
                className="flex flex-col items-center gap-2 rounded-2xl bg-white/20 p-4 text-center active:bg-white/30"
              >
                <Phone className="h-6 w-6" />
                <span className="text-sm font-bold">112'yi Ara</span>
                <span className="text-[10px] text-white/60">Ambulans / polis / itfaiye</span>
              </a>
              <button
                type="button"
                onClick={() => triggerVibration([300, 200, 300, 200, 600])}
                className="flex flex-col items-center gap-2 rounded-2xl bg-white/15 p-4 active:bg-white/25"
              >
                <Siren className="h-6 w-6" />
                <span className="text-sm font-semibold">Siren Çaldır</span>
                <span className="text-[10px] text-white/60">Dikkat çeker</span>
              </button>
            </div>

            {location && (
              <p className="text-center text-xs text-white/70">
                Konum: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
              </p>
            )}

            <Button
              onClick={cancelEmergency}
              className="h-14 w-full rounded-2xl bg-white text-lg font-bold text-red-600 hover:bg-white/90"
            >
              Ben Güvendeyim — Durdur
            </Button>
          </section>
        )}

        {/* ── Hızlı Erişim: Aile Ara ── */}
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
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-red-600">
                    <Phone className="h-5 w-5" />
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Diğer yardım hatları ── */}
        {!alert && (
          <section className="space-y-3">
            <h2 className="text-base font-bold tracking-wide text-white/90">YARDIM HATLARI</h2>
            <div className="grid w-full grid-cols-3 gap-2">
              {SUPPORT_EMERGENCY_NUMBERS.map((num) => {
                const Icon = num.icon;
                return (
                  <a
                    key={num.id}
                    href={num.telHref}
                    className="flex flex-col items-center gap-1.5 rounded-xl bg-white/10 p-3 text-center transition-colors active:bg-white/20"
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-bold">{num.phone}</span>
                    <span className="text-[10px] text-white/60 leading-tight">{num.name}</span>
                  </a>
                );
              })}
            </div>
          </section>
        )}

        {/* Aile arama onayı */}
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

        {/* Konum hatası */}
        {locationError && !isActive && (
          <p className="text-center text-xs text-white/50">{locationError}</p>
        )}
      </div>
    </div>
  );
}
