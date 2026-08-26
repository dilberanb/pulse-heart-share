import { useEffect, useRef, useState, useCallback } from "react";
import {
  ShieldCheck,
  HelpCircle,
  Phone,
  AlertTriangle,
  Volume2,
  Settings,
  Power,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { triggerVibration } from "@/lib/location";

interface SeniorModeProps {
  onExit?: () => void;
}

const AUTO_SAFE_INTERVAL_MS = 6 * 60 * 60 * 1000; // 6 saat

export function SeniorMode({ onExit }: SeniorModeProps) {
  const [lastSent, setLastSent] = useState<Date | null>(null);
  const [autoSafeEnabled, setAutoSafeEnabled] = useState(false);
  const [confirmAction, setConfirmAction] = useState<"safe" | "help" | "family" | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const sendSafe = useCallback(() => {
    setLastSent(new Date());
    setConfirmAction(null);
  }, []);

  const callHelp = useCallback(() => {
    window.open("tel:112", "_self");
    setConfirmAction(null);
  }, []);

  const callFamily = useCallback(() => {
    window.open("tel:+905321234567", "_self");
    setConfirmAction(null);
  }, []);

  // Otomatik güvendeyim
  useEffect(() => {
    if (!autoSafeEnabled) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      sendSafe();
    }, AUTO_SAFE_INTERVAL_MS);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [autoSafeEnabled, sendSafe]);

  const handleAction = (action: "safe" | "help" | "family") => {
    setConfirmAction(action);
  };

  const confirmActionHandler = () => {
    if (confirmAction === "safe") sendSafe();
    else if (confirmAction === "help") callHelp();
    else if (confirmAction === "family") callFamily();
  };

  return (
    <div className="fixed inset-0 z-[90] flex flex-col bg-[#0a0e1a] text-white">
      {/* Üst bar */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary">
            <ShieldCheck className="h-4 w-4 text-primary-foreground" />
          </span>
          <span className="text-sm font-bold tracking-wide">NABIZ</span>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white/60 transition-colors hover:bg-white/15 hover:text-white"
          aria-label="Normal moda dön"
        >
          <Power className="h-5 w-5" />
        </button>
      </div>

      {/* Ana içerik */}
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6">
        {confirmAction ? (
          /* Onay ekranı */
          <div className="flex flex-col items-center gap-6 text-center">
            <div
              className={cn(
                "flex h-24 w-24 items-center justify-center rounded-full",
                confirmAction === "safe" && "bg-emerald-500/20",
                confirmAction === "help" && "bg-red-500/20",
                confirmAction === "family" && "bg-amber-500/20",
              )}
            >
              {confirmAction === "safe" && (
                <ShieldCheck className="h-12 w-12 text-emerald-400" />
              )}
              {confirmAction === "help" && (
                <HelpCircle className="h-12 w-12 text-red-400" />
              )}
              {confirmAction === "family" && (
                <Phone className="h-12 w-12 text-amber-400" />
              )}
            </div>

            <p className="text-xl font-bold">
              {confirmAction === "safe" && "Güvendeyim bildirilecek"}
              {confirmAction === "help" && "112 Aranacak"}
              {confirmAction === "family" && "Aile(baba) Aranacak"}
            </p>

            <div className="flex w-full flex-col gap-3">
              <Button
                onClick={confirmActionHandler}
                className={cn(
                  "h-[72px] w-full rounded-2xl text-xl font-bold",
                  confirmAction === "safe" &&
                    "bg-emerald-500 text-white hover:bg-emerald-600",
                  confirmAction === "help" &&
                    "bg-red-500 text-white hover:bg-red-600",
                  confirmAction === "family" &&
                    "bg-amber-500 text-black hover:bg-amber-600",
                )}
              >
                Evet, Onaylıyorum
              </Button>
              <Button
                variant="outline"
                onClick={() => setConfirmAction(null)}
                className="h-14 rounded-2xl border-white/20 bg-transparent text-lg font-semibold text-white hover:bg-white/10"
              >
                İptal
              </Button>
            </div>
          </div>
        ) : (
          /* Ana butonlar */
          <>
            <p className="mb-2 text-center text-lg font-medium text-white/60">
              Durumunu bildir
            </p>

            {/* Güvendeyim */}
            <button
              type="button"
              onClick={() => handleAction("safe")}
              className="flex h-[80px] w-full items-center justify-center gap-4 rounded-3xl bg-emerald-500 text-2xl font-black text-white transition-all active:scale-[0.97] hover:brightness-110"
            >
              <ShieldCheck className="h-8 w-8" />
              Güvendeyim
            </button>

            {/* Yardım Lazım */}
            <button
              type="button"
              onClick={() => handleAction("help")}
              className="flex h-[80px] w-full items-center justify-center gap-4 rounded-3xl bg-red-500 text-2xl font-black text-white transition-all active:scale-[0.97] hover:brightness-110"
            >
              <HelpCircle className="h-8 w-8" />
              Yardım Lazım
            </button>

            {/* Ailemi ara */}
            <button
              type="button"
              onClick={() => handleAction("family")}
              className="flex h-[80px] w-full items-center justify-center gap-4 rounded-3xl bg-amber-500 text-2xl font-black text-black transition-all active:scale-[0.97] hover:brightness-110"
            >
              <Phone className="h-8 w-8" />
              Ailemi ara
            </button>

            {/* Son bilgi */}
            {lastSent && (
              <p className="mt-2 text-sm text-white/40">
                Son bildirim: {lastSent.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
              </p>
            )}
          </>
        )}
      </div>

      {/* Alt ayarlar */}
      <div className="px-6 pb-8">
        <button
          type="button"
          onClick={() => setAutoSafeEnabled((p) => !p)}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-2xl border py-3 text-sm font-medium transition-colors",
            autoSafeEnabled
              ? "border-primary/40 bg-primary/10 text-primary"
              : "border-white/15 bg-white/5 text-white/40",
          )}
        >
          <Settings className="h-4 w-4" />
          {autoSafeEnabled
            ? "Otomatik Güvendeyim: AÇIK (6 saatte bir)"
            : "Otomatik Güvendeyim: KAPALI"}
        </button>

        {/* Her zaman görünür SOS */}
        <a
          href="tel:112"
          className="mt-4 flex items-center justify-center gap-2 rounded-2xl bg-red-600 py-4 text-lg font-bold text-white transition-colors active:bg-red-700"
        >
          <AlertTriangle className="h-5 w-5" />
          SOS — ACİL ARAMA
        </a>
      </div>
    </div>
  );
}
