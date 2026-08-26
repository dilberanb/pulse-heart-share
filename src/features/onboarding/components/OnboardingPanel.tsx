import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Heart,
  UserPlus,
  Bell,
  CheckCircle2,
  Smartphone,
  Maximize2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 6;

const LABEL_OPTIONS = [
  { id: "pet_owner", text: "Evcil hayvanim var", icon: "\uD83D\uDC15" },
  { id: "chronic", text: "Kronik hastaligim var", icon: "\uD83D\uDC8A" },
  { id: "surgery", text: "Yeni ameliyat oldum", icon: "\uD83C\uDFE5" },
  { id: "disabled", text: "Engel durumum var", icon: "\u267F" },
  { id: "child", text: "18 yas altindayim", icon: "\uD83D\uDC76" },
];

interface CircleMember {
  name: string;
  phone: string;
}

export function OnboardingPanel({ onComplete }: { onComplete?: () => void }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [coreFamily, setCoreFamily] = useState<CircleMember[]>([]);
  const [closeCircle, setCloseCircle] = useState<CircleMember[]>([]);
  const [newCoreName, setNewCoreName] = useState("");
  const [newCorePhone, setNewCorePhone] = useState("");
  const [newCloseName, setNewCloseName] = useState("");
  const [newClosePhone, setNewClosePhone] = useState("");
  const [fullscreenNotif, setFullscreenNotif] = useState(false);

  function goNext() {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }
  function goBack() {
    setStep((s) => Math.max(s - 1, 1));
  }

  function toggleLabel(id: string) {
    setSelectedLabels((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id],
    );
  }

  function addCore() {
    if (newCoreName.trim() && newCorePhone.trim()) {
      setCoreFamily((prev) => [...prev, { name: newCoreName.trim(), phone: newCorePhone.trim() }]);
      setNewCoreName("");
      setNewCorePhone("");
    }
  }
  function removeCore(idx: number) {
    setCoreFamily((prev) => prev.filter((_, i) => i !== idx));
  }

  function addClose() {
    if (newCloseName.trim() && newClosePhone.trim()) {
      setCloseCircle((prev) => [...prev, { name: newCloseName.trim(), phone: newClosePhone.trim() }]);
      setNewCloseName("");
      setNewClosePhone("");
    }
  }
  function removeClose(idx: number) {
    setCloseCircle((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg space-y-6">
        <StepIndicator current={step} total={TOTAL_STEPS} />

        <div className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)]">
          {step === 1 && (
            <div className="flex flex-col items-center gap-5 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
                <Heart className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground">Nabiz'a hos geldiniz</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Sevdiklerinizle guvenli baglanti kurun. Anlik durumunuzu paylasin,
                  acil durumlarda aninda haberdar olun.
                </p>
              </div>
              <Button onClick={goNext} size="lg" className="w-full gap-2 text-base">
                Basla
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-foreground">Temel Bilgiler</h2>
                <p className="text-xs text-muted-foreground">Profil bilgilerinizi girin.</p>
              </div>
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Ad Soyad</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ornegin: Ayse Yilmaz"
                    className="h-11 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Yas</label>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Ornegin: 32"
                    className="h-11 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-foreground">Telefon Numarasi</label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05XX XXX XX XX"
                    className="h-11 text-sm"
                  />
                </div>
              </div>
              <NavButtons onBack={goBack} onNext={goNext} />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-foreground">Durum Etiketleri</h2>
                <p className="text-xs text-muted-foreground">
                  Size uygun etiketleri secin. Secimlerinizi daha sonra degistirebilirsiniz.
                </p>
              </div>
              <div className="space-y-2">
                {LABEL_OPTIONS.map((opt) => (
                  <label
                    key={opt.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                      selectedLabels.includes(opt.id)
                        ? "border-primary/40 bg-primary/5"
                        : "border-border bg-background hover:bg-muted/50",
                    )}
                  >
                    <Checkbox
                      checked={selectedLabels.includes(opt.id)}
                      onCheckedChange={() => toggleLabel(opt.id)}
                      className="h-5 w-5"
                    />
                    <span className="text-lg">{opt.icon}</span>
                    <span className="text-sm font-medium text-foreground">{opt.text}</span>
                  </label>
                ))}
              </div>
              <NavButtons onBack={goBack} onNext={goNext} />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-foreground">Cember Tercihi</h2>
                <p className="text-xs text-muted-foreground">
                  Yasam daki en yakin kisilerinizi ekleyin.
                </p>
              </div>

              <CircleSection
                title="Cekirdek Aile"
                icon={<Heart className="h-4 w-4 text-red-400" />}
                members={coreFamily}
                onRemove={removeCore}
                name={newCoreName}
                phone={newCorePhone}
                onNameChange={setNewCoreName}
                onPhoneChange={setNewCorePhone}
                onAdd={addCore}
                placeholderName="Aile uyesi adi"
              />

              <CircleSection
                title="Yakin Cevre"
                icon={<UserPlus className="h-4 w-4 text-blue-400" />}
                members={closeCircle}
                onRemove={removeClose}
                name={newCloseName}
                phone={newClosePhone}
                onNameChange={setNewCloseName}
                onPhoneChange={setNewClosePhone}
                onAdd={addClose}
                placeholderName="Arkadas adi"
              />

              <NavButtons onBack={goBack} onNext={goNext} />
            </div>
          )}

          {step === 5 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-bold text-foreground">Bildirim Tercihi</h2>
                <p className="text-xs text-muted-foreground">
                  Bildirimlerin nasil gorunmesini istediginizi secin.
                </p>
              </div>

              <div className="space-y-3">
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors",
                    !fullscreenNotif
                      ? "border-primary/40 bg-primary/5"
                      : "border-border hover:bg-muted/50",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      !fullscreenNotif ? "bg-primary/15" : "bg-muted",
                    )}
                  >
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Bildirim cubugu</p>
                    <p className="text-xs text-muted-foreground">
                      Standart bildirim olarak gorunur.
                    </p>
                  </div>
                  <Switch
                    checked={fullscreenNotif}
                    onCheckedChange={setFullscreenNotif}
                    className="data-[state=checked]:bg-primary"
                  />
                </label>

                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition-colors",
                    fullscreenNotif
                      ? "border-primary/40 bg-primary/5"
                      : "border-border hover:bg-muted/50",
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-lg",
                      fullscreenNotif ? "bg-primary/15" : "bg-muted",
                    )}
                  >
                    <Maximize2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">Tam ekran bildirim</p>
                    <p className="text-xs text-muted-foreground">
                      Oncelikli durumlarda tam ekran gozukur.
                    </p>
                  </div>
                  <Switch
                    checked={fullscreenNotif}
                    onCheckedChange={setFullscreenNotif}
                    className="data-[state=checked]:bg-primary"
                  />
                </label>
              </div>

              <NavButtons onBack={goBack} onNext={goNext} />
            </div>
          )}

          {step === 6 && (
            <div className="space-y-5">
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Haziriz!</h2>
                  <p className="text-xs text-muted-foreground">
                    Hesabiniz basariyla olusturuldu.
                  </p>
                </div>
              </div>

              <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-4">
                <SummaryRow label="Ad" value={name || "Belirtilmedi"} />
                <SummaryRow label="Yas" value={age || "Belirtilmedi"} />
                <SummaryRow label="Telefon" value={phone || "Belirtilmedi"} />
                <SummaryRow
                  label="Etiketler"
                  value={
                    selectedLabels.length > 0
                      ? selectedLabels
                          .map((id) => LABEL_OPTIONS.find((o) => o.id === id)?.text)
                          .join(", ")
                      : "Yok"
                  }
                />
                <SummaryRow
                  label="Cekirdek Aile"
                  value={coreFamily.length > 0 ? coreFamily.map((m) => m.name).join(", ") : "Yok"}
                />
                <SummaryRow
                  label="Yakin Cevre"
                  value={
                    closeCircle.length > 0 ? closeCircle.map((m) => m.name).join(", ") : "Yok"
                  }
                />
                <SummaryRow
                  label="Bildirim"
                  value={fullscreenNotif ? "Tam ekran" : "Bildirim cubugu"}
                />
              </div>

              <div className="space-y-2">
                <Button onClick={onComplete} size="lg" className="w-full gap-2 text-base">
                  Uygulamaya Gec
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <Button onClick={goBack} variant="ghost" size="lg" className="w-full">
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Geri Don
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === current;
        const isDone = stepNum < current;
        return (
          <div key={i} className="flex items-center gap-1.5">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                isDone && "bg-primary text-primary-foreground",
                isActive && "bg-primary text-primary-foreground",
                !isDone && !isActive && "bg-muted text-muted-foreground",
              )}
            >
              {isDone ? "\u2713" : stepNum}
            </div>
            {i < total - 1 && (
              <div
                className={cn(
                  "h-0.5 w-6 rounded-full",
                  stepNum < current ? "bg-primary" : "bg-muted",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function NavButtons({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <div className="flex gap-2 pt-2">
      <Button onClick={onBack} variant="outline" size="lg" className="flex-1 gap-1">
        <ArrowLeft className="h-4 w-4" />
        Geri
      </Button>
      <Button onClick={onNext} size="lg" className="flex-1 gap-1">
        Ileri
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function CircleSection({
  title,
  icon,
  members,
  onRemove,
  name,
  phone,
  onNameChange,
  onPhoneChange,
  onAdd,
  placeholderName,
}: {
  title: string;
  icon: React.ReactNode;
  members: CircleMember[];
  onRemove: (idx: number) => void;
  name: string;
  phone: string;
  onNameChange: (v: string) => void;
  onPhoneChange: (v: string) => void;
  onAdd: () => void;
  placeholderName: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>
      {members.map((m, i) => (
        <div
          key={i}
          className="flex items-center justify-between rounded-lg border border-border px-3 py-2"
        >
          <div>
            <p className="text-sm font-medium text-foreground">{m.name}</p>
            <p className="text-[11px] text-muted-foreground">{m.phone}</p>
          </div>
          <button
            onClick={() => onRemove(i)}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <Input
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={placeholderName}
          className="h-10 flex-1 text-sm"
        />
        <Input
          value={phone}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="05XX..."
          className="h-10 w-32 text-sm"
        />
        <Button
          onClick={onAdd}
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground text-right">{value}</span>
    </div>
  );
}
