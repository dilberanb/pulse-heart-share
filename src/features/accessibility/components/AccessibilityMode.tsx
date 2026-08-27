import { useState } from "react";
import {
  Accessibility,
  Building2,
  Ear,
  Brain,
  Hand,
  SunMedium,
  Type,
  MousePointerClick,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type AccessibilityBadge =
  | "wheelchair"
  | "elevator"
  | "visual"
  | "hearing"
  | "cognitive"
  | "mobility";

interface BadgeDef {
  id: AccessibilityBadge;
  label: string;
  desc: string;
  icon: typeof Accessibility;
  color: string;
}

const BADGES: BadgeDef[] = [
  { id: "wheelchair", label: "Tekerlekli Sandalye", desc: "Rampasız/asansörsüz alanlar sorun olabilir", icon: Accessibility, color: "text-blue-400" },
  { id: "elevator", label: "Asansör Gerekli", desc: "Merdivenler kullanılamıyor", icon: Building2, color: "text-indigo-400" },
  { id: "visual", label: "Görme Desteği", desc: "Büyük yazı, yüksek kontrast", icon: SunMedium, color: "text-amber-400" },
  { id: "hearing", label: "İşitme Desteği", desc: "Yazılı yönlendirme tercih edilir", icon: Ear, color: "text-cyan-400" },
  { id: "cognitive", label: "Bilişsel Destek", desc: "Basit dil, net adımlar", icon: Brain, color: "text-violet-400" },
  { id: "mobility", label: "Hareket Kısıtlılığı", desc: "Acil çıkışta yardım gerekebilir", icon: Hand, color: "text-rose-400" },
];

export function AccessibilityMode() {
  const [selected, setSelected] = useState<AccessibilityBadge[]>([]);

  const toggle = (id: AccessibilityBadge) => {
    setSelected((cur) =>
      cur.includes(id) ? cur.filter((b) => b !== id) : [...cur, id],
    );
  };

  return (
    <div className="space-y-5">
      {/* Açıklama */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10">
            <Accessibility className="h-5 w-5 text-blue-400" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-foreground">Erişilebilirlik Rozetleri</h3>
            <p className="text-xs text-muted-foreground">
              Aile üyeleri ve çevren, acil durumda nasıl yardım etmesi gerektiğini bu rozetlerden öğrenir.
            </p>
          </div>
        </div>
      </div>

      {/* Rozet seçimi */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {BADGES.map((b) => {
          const Icon = b.icon;
          const active = selected.includes(b.id);
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => toggle(b.id)}
              className={cn(
                "flex items-start gap-3 rounded-xl border bg-card p-4 text-left transition-colors",
                active
                  ? "border-primary/50 bg-primary/5"
                  : "border-border hover:bg-muted/30",
              )}
            >
              <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-muted/50", b.color)}>
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-foreground">{b.label}</p>
                <p className="text-xs text-muted-foreground">{b.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Aktif rozet görünümü */}
      {selected.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="mb-2 text-xs font-semibold text-muted-foreground">
            Profilinde görünen rozetler:
          </h4>
          <div className="flex flex-wrap gap-2">
            {selected.map((id) => {
              const b = BADGES.find((x) => x.id === id)!;
              const Icon = b.icon;
              return (
                <span
                  key={id}
                  className="flex items-center gap-1.5 rounded-full bg-muted/50 px-3 py-1.5 text-xs font-medium text-foreground"
                >
                  <Icon className={cn("h-3.5 w-3.5", b.color)} />
                  {b.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Arayüz tercihleri */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="mb-3 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10">
            <Type className="h-4 w-4 text-primary" />
          </span>
          <h3 className="text-sm font-bold text-foreground">Arayüz Tercihleri</h3>
        </div>
        <div className="space-y-3">
          <PreferenceToggle icon={Type} label="Büyük yazı ve yüksek kontrast" />
          <PreferenceToggle icon={MousePointerClick} label="Büyük dokunma hedefleri" />
          <PreferenceToggle icon={Brain} label="Basit dil / kısa cümleler" />
        </div>
      </div>
    </div>
  );
}

function PreferenceToggle({
  icon: Icon,
  label,
}: {
  icon: typeof Type;
  label: string;
}) {
  const [on, setOn] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className="flex w-full items-center gap-3 rounded-lg bg-muted/30 px-3 py-2.5 text-left transition-colors hover:bg-muted/50"
    >
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted/60 text-muted-foreground">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      <span
        className={cn(
          "flex h-6 w-11 items-center rounded-full p-0.5 transition-colors",
          on ? "bg-primary" : "bg-muted/70",
        )}
      >
        <span
          className={cn(
            "h-5 w-5 rounded-full bg-white shadow transition-transform",
            on && "translate-x-5",
          )}
        />
      </span>
    </button>
  );
}
