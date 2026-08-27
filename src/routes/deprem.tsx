import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, AlertTriangle, Shield, Radio } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { EvacuationPlan } from "@/features/deprem/components/EvacuationPlan";

export const Route = createFileRoute("/deprem")({
  head: () => ({
    meta: [
      { title: "Deprem — Nabız" },
      {
        name: "description",
        content: "Deprem hazırlık durumunu ve acil durum bilgilerini görüntüle.",
      },
    ],
  }),
  component: DepremPage,
});

const CHECKLIST_STORAGE = "nabiz:deprem:checklist";
const STATUS_STORAGE = "nabiz:deprem:status";

const CHECKLIST_ITEMS = [
  "Acil durum çantası hazır mı?",
  "Tahliye rotası belirlendi mi?",
  "Aile üyeleri bilgilendirildi mi?",
  "Toplanma alanı konuşuldu mu?",
  "Gaz vanası kapatma tatbikatı yapıldı mı?",
];

type StatusKey = "canta" | "tahliye" | "toplanma" | "aile";
type StatusValue = "hazir" | "yok" | "bekliyor";

const STATUS_ITEMS: {
  key: StatusKey;
  icon: React.ReactNode;
  label: string;
  options: { value: StatusValue; label: string; color: string }[];
}[] = [
  {
    key: "canta",
    icon: <Shield className="h-5 w-5 text-emerald-400" />,
    label: "Çantam",
    options: [
      { value: "hazir", label: "Hazır", color: "emerald" },
      { value: "bekliyor", label: "Hazırlanıyor", color: "amber" },
      { value: "yok", label: "Yok", color: "red" },
    ],
  },
  {
    key: "tahliye",
    icon: <AlertTriangle className="h-5 w-5 text-amber-400" />,
    label: "Tahliye Planı",
    options: [
      { value: "hazir", label: "Belirlendi", color: "emerald" },
      { value: "bekliyor", label: "Planlanıyor", color: "amber" },
      { value: "yok", label: "Yok", color: "red" },
    ],
  },
  {
    key: "toplanma",
    icon: <Radio className="h-5 w-5 text-blue-400" />,
    label: "Toplanma Alanı",
    options: [
      { value: "hazir", label: "Beklerim", color: "emerald" },
      { value: "bekliyor", label: "Araştırılıyor", color: "amber" },
      { value: "yok", label: "Bilinmiyor", color: "red" },
    ],
  },
  {
    key: "aile",
    icon: <MapPin className="h-5 w-5 text-purple-400" />,
    label: "Aile Bilgileri",
    options: [
      { value: "hazir", label: "Tamamlandı", color: "emerald" },
      { value: "bekliyor", label: "Derleniyor", color: "amber" },
      { value: "yok", label: "Eksik", color: "red" },
    ],
  },
];

const DEFAULT_STATUS: Record<StatusKey, StatusValue> = {
  canta: "hazir",
  tahliye: "hazir",
  toplanma: "hazir",
  aile: "hazir",
};

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function DepremPage() {
  const [checklist, setChecklist] = useState<boolean[]>(() =>
    loadJSON(CHECKLIST_STORAGE, [true, true, false, false, false]),
  );
  const [status, setStatus] = useState<Record<StatusKey, StatusValue>>(() =>
    loadJSON(STATUS_STORAGE, DEFAULT_STATUS),
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(CHECKLIST_STORAGE, JSON.stringify(checklist));
    } catch {
      /* depolama kullanılamıyorsa sessizce geç */
    }
  }, [checklist]);

  useEffect(() => {
    try {
      window.localStorage.setItem(STATUS_STORAGE, JSON.stringify(status));
    } catch {
      /* depolama kullanılamıyorsa sessizce geç */
    }
  }, [status]);

  function toggleItem(i: number) {
    setChecklist((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  }

  function setStatusKey(key: StatusKey, value: StatusValue) {
    setStatus((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <h1 className="sr-only">Deprem hazırlık sayfası</h1>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-sos/10">
            <MapPin className="h-5 w-5 text-sos" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Deprem Hazırlık</h2>
            <p className="text-xs text-muted-foreground">Aile hazırlık durumu ve acil bilgiler</p>
          </div>
        </div>

        {/* Hazırlık Durumu */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Hazırlık Durumu</h3>
            <button
              type="button"
              onClick={() => document.getElementById("tahliye-plani")?.scrollIntoView({ behavior: "smooth" })}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Tahliye Planını Göster ↓
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {STATUS_ITEMS.map((item) => (
              <StatusCard
                key={item.key}
                icon={item.icon}
                label={item.label}
                options={item.options}
                value={status[item.key]}
                onChange={(v) => setStatusKey(item.key, v)}
              />
            ))}
          </div>
        </div>

        {/* Tahliye Planı */}
        <div id="tahliye-plani" className="scroll-mt-6">
          <EvacuationPlan />
        </div>

        {/* Checklist */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Deprem Checklist</h3>
          <p className="text-xs text-muted-foreground">
            Tamamladıklarını işaretle; seçimlerin cihazında kaydedilir.
          </p>

          {CHECKLIST_ITEMS.map((label, i) => (
            <ChecklistItem
              key={label}
              label={label}
              checked={checklist[i] ?? false}
              onChange={() => toggleItem(i)}
            />
          ))}
        </div>
      </div>
    </AppShell>
  );
}

const COLOR_BORDER: Record<string, string> = {
  emerald: "border-emerald-500/20 bg-emerald-500/5",
  amber: "border-amber-500/20 bg-amber-500/5",
  blue: "border-blue-500/20 bg-blue-500/5",
  purple: "border-purple-500/20 bg-purple-500/5",
  red: "border-red-500/20 bg-red-500/5",
};

function StatusCard({
  icon,
  label,
  value,
  options,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  options: { value: string; label: string; color: string }[];
  onChange: (value: StatusValue) => void;
}) {
  const current = options.find((o) => o.value === value) ?? options[0]!;
  return (
    <div className={`rounded-lg border p-3 ${COLOR_BORDER[current.color] ?? ""}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value as StatusValue)}
            className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
              o.value === value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/60"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChecklistItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/30 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-border accent-primary"
      />
      <span className={`text-sm ${checked ? "text-muted-foreground line-through" : "text-foreground"}`}>
        {label}
      </span>
    </label>
  );
}
