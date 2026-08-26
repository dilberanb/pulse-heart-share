import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Heart,
  Loader2,
  Phone,
  Send,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { useSendOtp } from "@/features/auth/hooks/useAuth";
import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/database";
import { toast } from "sonner";

type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];

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

type Step = "info" | "otp";

export function RegisterForm() {
  const [step, setStep] = useState<Step>("info");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [maskedPhone, setMaskedPhone] = useState("");

  const sendOtp = useSendOtp();

  async function handleSendOtp() {
    const e164 = toE164TR(phone);
    setMaskedPhone(e164);
    sendOtp.mutate(e164, {
      onSuccess: () => setStep("otp"),
    });
  }

  async function handleVerify() {
    if (otp.length !== 6) return;

    const { data: sessionData, error: verifyError } =
      await supabase.auth.verifyOtp({
        phone: maskedPhone,
        token: otp,
        type: "sms",
      });

    if (verifyError || !sessionData.session) {
      toast.error("Doğrulama başarısız. Kodu kontrol et.");
      return;
    }

    const userId = sessionData.session.user.id;

    const profileData: ProfileInsert = {
      id: userId,
      full_name: fullName.trim(),
      phone: maskedPhone,
    };
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert(profileData);

    if (profileError) {
      toast.error("Profil oluşturulamadı. Tekrar dener misin.");
      return;
    }

    toast.success("Hesabın oluşturuldu! Hoş geldin");
    window.location.href = "/";
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
          <h1 className="text-2xl font-bold tracking-tight">Nabız'a katıl</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sevdiklerinle bağlantıda kal
          </p>
        </div>
      </div>

      {/* Form kartı */}
      <div className="w-full space-y-6 rounded-3xl border border-border bg-card p-6">
        {step === "info" ? (
          <>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Hesap oluştur</h2>
              <p className="text-sm text-muted-foreground">
                Bilgilerini gir ve telefonunu doğrula.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full-name">Ad Soyad</Label>
                <div className="relative">
                  <User className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="full-name"
                    type="text"
                    placeholder="Adını yaz"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-12 rounded-2xl pl-10 text-base"
                    aria-label="Ad Soyad"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefon numarası</Label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="05XX XXX XX XX"
                    maxLength={11}
                    value={phone}
                    onChange={(e) => setPhone(formatTurkishPhone(e.target.value))}
                    className="h-12 rounded-2xl pl-10 text-base tracking-wider"
                    aria-label="Telefon numarası"
                  />
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="h-12 w-full gap-2 rounded-2xl text-base"
              disabled={!fullName.trim() || phone.length < 10 || sendOtp.isPending}
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
                setStep("info");
                setOtp("");
              }}
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Geri dön
            </button>

            <div className="space-y-1">
              <h2 className="text-lg font-semibold">Telefonunu doğrula</h2>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{maskedPhone}</span>{" "}
                numarasına gönderilen 6 haneli kodu gir.
              </p>
            </div>

            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                onComplete={(value) => setOtp(value)}
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
              disabled={otp.length !== 6}
              onClick={handleVerify}
            >
              Doğrula ve katıl
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

      {/* Giriş linki */}
      <p className="mt-6 text-sm text-muted-foreground">
        Zaten hesabın var mı?{" "}
        <Link
          to="/giris"
          className="font-medium text-primary underline-offset-4 transition-colors hover:underline"
        >
          Giriş yap
        </Link>
      </p>
    </div>
  );
}
