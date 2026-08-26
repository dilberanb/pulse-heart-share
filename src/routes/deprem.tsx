import { createFileRoute } from "@tanstack/react-router";
import { MapPin, AlertTriangle, Shield, Radio } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";

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

function DepremPage() {
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

        {/* Preparation Status */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Hazırlık Durumu</h3>

          <div className="grid grid-cols-2 gap-3">
            <StatusCard
              icon={<Shield className="h-5 w-5 text-emerald-400" />}
              label="Çantam"
              value="Hazır"
              color="emerald"
            />
            <StatusCard
              icon={<AlertTriangle className="h-5 w-5 text-amber-400" />}
              label="Tahliye Planı"
              value="Belirlendi"
              color="amber"
            />
            <StatusCard
              icon={<Radio className="h-5 w-5 text-blue-400" />}
              label="Toplanma Alanı"
              value="Yakın"
              color="blue"
            />
            <StatusCard
              icon={<MapPin className="h-5 w-5 text-purple-400" />}
              label="Aile Bílgileri"
              value="Tamamlandı"
              color="purple"
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Deprem Checklist</h3>

          <ChecklistItem label="Acil durum çantası hazır mı?" checked />
          <ChecklistItem label="Tahliye rotası belirlendi mi?" checked />
          <ChecklistItem label="Aile üyeleri bilgilendirildi mi?" checked={false} />
          <ChecklistItem label="Toplanma alanı konuşuldu mu?" checked={false} />
          <ChecklistItem label="Gaz vanası kapatma tatbikatı yapıldı mı?" checked={false} />
        </div>

        {/* Emergency contacts */}
        <div className="rounded-xl border border-border bg-card p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Acil Durum Numaraları</h3>

          <div className="space-y-2">
            <ContactRow name="AFAD" number="122" />
            <ContactRow name="AKUT" number="444 25 88" />
            <ContactRow name="İtfaiye" number="110" />
            <ContactRow name="Polis" number="155" />
            <ContactRow name="Ambulans" number="112" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function StatusCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: "emerald" | "amber" | "blue" | "purple";
}) {
  const colorMap = {
    emerald: "border-emerald-500/20 bg-emerald-500/5",
    amber: "border-amber-500/20 bg-amber-500/5",
    blue: "border-blue-500/20 bg-blue-500/5",
    purple: "border-purple-500/20 bg-purple-500/5",
  };

  return (
    <div className={`rounded-lg border p-3 ${colorMap[color]}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="mt-1.5 text-sm font-semibold text-foreground">{value}</p>
    </div>
  );
}

function ChecklistItem({ label, checked }: { label: string; checked: boolean }) {
  return (
    <label className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted/30 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        readOnly
        className="h-4 w-4 rounded border-border accent-primary"
      />
      <span className={`text-sm ${checked ? "text-muted-foreground line-through" : "text-foreground"}`}>
        {label}
      </span>
    </label>
  );
}

function ContactRow({ name, number }: { name: string; number: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
      <span className="text-sm font-medium text-foreground">{name}</span>
      <span className="text-sm text-primary font-mono">{number}</span>
    </div>
  );
}
