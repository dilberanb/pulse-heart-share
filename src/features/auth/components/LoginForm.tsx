import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Heart, Loader2, Phone, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { useSendOtp, useVerifyOtp } from "@/features/auth/hooks/useAuth";
import { cn } from "@/lib/utils";

/** Türk telefon numarası formatı: 0 5XX XXX XX XX → +90 5XXXXXXXXX */
function formatTurkishPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 0) return "";
  if (digits.startsWith("0")) return digits;
  return digits;
}

function toE164TR(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0")) return `+90${digits.slice(1)}`;
  if (digits.startsWith("90")) return `+${digits}`;
  return `+90${digits}`;
}

export function LoginForm() {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");

  const sendOtp = useSendOtp();
  const verifyOtp = useVerifyOtp();

  function handleSendOtp() {
    const e164 = toE164TR(phone);
    setMaskedPhone(e164);
    sendOtp.mutate(e164, {
      onSuccess: () => setStep("otp"),
    });
  }

  function handleVerify() {
    if (otp.length !== 6) return;
    verifyOtp.mutate({ phone: maskedPhone, token: otp });
  }

  function handleResend() {
    sendOtp.mutate(maskedPhone);
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-sm flex-col items-center justify-center px-6 py-12">
      {/* Marka */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <span className="grid h-16 w-16 place-items-center rounded-3xl bg-primary text-primary-foreground">
          <Heart className="h-7 w-7" />
        </span>
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">Nabız</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sevdiklerinle bağlantıda kal
          </p>
        </div>
      </div>

      {/* Form kartı */}
      <div className="w-full space-y-6 rounded-3xl border border-border bg-card p-6">
        {step === "phone" ? (
          <>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Giriş yap</h2>
              <p className="text-sm text-muted-foreground">
                Telefon numaranı gir, sana tek kullanımlık kod gönderelim.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefon numarası</Label>
              <div className="relative">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted-foreground">
                  🇹🇷
                </span>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="05XX XXX XX XX"
                  maxLength={11}
                  value={phone}
                  onChange={(e) => setPhone(formatTurkishPhone(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && phone.length >= 10) handleSendOtp();
                  }}
                  className="h-12 rounded-2xl pl-10 text-base tracking-wider"
                  aria-label="Telefon numarası"
                />
              </div>
            </div>

            <Button
              size="lg"
              className="h-12 w-full gap-2 rounded-2xl text-base"
              disabled={phone.length < 10 || sendOtp.isPending}
              onClick={handleSendOtp}
            >
              {sendOtp.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Kod gönder
            </Button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => {
                setStep("phone");
                setOtp("");
              }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Geri dön
            </button>

            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Kodu doğrula</h2>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{maskedPhone}</span> numarasına
                gönderilen 6 haneli kodu gir.
              </p>
            </div>

            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                onComplete={(value) => {
                  setOtp(value);
                  verifyOtp.mutate({ phone: maskedPhone, token: value });
                }}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              size="lg"
              className="h-12 w-full gap-2 rounded-2xl text-base"
              disabled={otp.length !== 6 || verifyOtp.isPending}
              onClick={handleVerify}
            >
              {verifyOtp.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Doğrula"
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Kod gelmedi mi?{" "}
              <button
                type="button"
                onClick={handleResend}
                disabled={sendOtp.isPending}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Tekrar gönder
              </button>
            </p>
          </>
        )}
      </div>

      {/* Kayıt linki */}
      <p className="mt-6 text-sm text-muted-foreground">
        Hesabın yok mu?{" "}
        <Link
          to="/kayit"
          className={cn(
            "font-medium text-primary underline-offset-4 transition-colors hover:underline",
          )}
        >
          Kayıt ol
        </Link>
      </p>
    </div>
  );
}
