import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Accessibility, PawPrint, Users, Route as RouteIcon, ArrowRight } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { MemoryMode } from "@/features/memory/components/MemoryMode";
import { AccessibilityMode } from "@/features/accessibility/components/AccessibilityMode";
import { PetStatus } from "@/features/status/components/PetStatus";
import { SafeCompanion } from "@/features/companion/components/SafeCompanion";
import { SeniorMode } from "@/features/elderly/components/SeniorMode";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/guvenli")({
  head: () => ({
    meta: [
      { title: "Güvenli Mod — Nabız" },
      {
        name: "description",
        content:
          "Alzheimer/hafıza desteği, engelli erişilebilirliği, evcil hayvan ve yaşlı modu — sevdiklerinin güvenliği için.",
      },
    ],
  }),
  component: GuvenliPage,
});

type TabKey = "memory" | "access" | "pet" | "companion" | "senior";

const TABS: { key: TabKey; label: string; icon: typeof Brain }[] = [
  { key: "memory", label: "Hafıza Desteği", icon: Brain },
  { key: "access", label: "Erişilebilirlik", icon: Accessibility },
  { key: "pet", label: "Evcil Hayvan", icon: PawPrint },
  { key: "companion", label: "Yol Arkadaşlığı", icon: RouteIcon },
  { key: "senior", label: "Yaşlı Modu", icon: Users },
];

function GuvenliPage() {
  const [tab, setTab] = useState<TabKey>("memory");
  const seniorMode = useAppStore((s) => s.seniorMode);
  const setSeniorMode = useAppStore((s) => s.setSeniorMode);

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">Güvenli Mod</h2>
            <p className="text-xs text-muted-foreground">
              Alzheimer, engelli, evcil hayvan ve yaşlı sevdiklerin için özelleştirilmiş destek
            </p>
          </div>
        </div>

        {/* Sekmeler */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-sm font-semibold transition-colors",
                  active
                    ? "border-primary/50 bg-primary/5 text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-muted/30",
                )}
              >
                <Icon className="h-5 w-5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* İçerik */}
        <div>
          {tab === "memory" && (
            <div className="space-y-4">
              <SectionIntro
                icon={<Brain className="h-5 w-5 text-violet-400" />}
                title="Alzheimer / Hafıza Desteği"
                desc="Karışıklık anında iletişim kurulabilmesi ve güvenlik için tasarlandı."
              />
              <MemoryMode />
            </div>
          )}

          {tab === "access" && (
            <div className="space-y-4">
              <SectionIntro
                icon={<Accessibility className="h-5 w-5 text-blue-400" />}
                title="Engelli / Erişilebilirlik"
                desc="Acil durumda nasıl yardım edeceğini çevrenin bilmesi için."
              />
              <AccessibilityMode />
            </div>
          )}

          {tab === "pet" && (
            <div className="space-y-4">
              <SectionIntro
                icon={<PawPrint className="h-5 w-5 text-amber-400" />}
                title="Evcil Hayvan Kaçışı / Güvenliği"
                desc="Evcil hayvanın durumunu paylaş ve acil durumda bildir."
              />
              <PetStatus
                pet={{
                  name: "Pamuk",
                  species: "Köpek",
                  breed: "Golden Retriever",
                  age: "3 yaş",
                }}
              />
            </div>
          )}

          {tab === "companion" && (
            <div className="space-y-4">
              <SectionIntro
                icon={<RouteIcon className="h-5 w-5 text-violet-400" />}
                title="Güvenli Yol Arkadaşı"
                desc="Gece eve dönerken ya da kaygılı olduğunda, güvendiğin kişilere sınırlı süreli canlı konum paylaş."
              />
              <SafeCompanion />
            </div>
          )}

          {tab === "senior" && (
            <div className="space-y-4">
              <SectionIntro
                icon={<Users className="h-5 w-5 text-emerald-400" />}
                title="Yaşlı Modu"
                desc="Daha büyük butonlar, daha sade ve anlaşılır arayüz."
              />
              <div className="rounded-xl border border-border bg-card p-5 text-center">
                <p className="mb-1 text-lg font-bold text-foreground">Büyük Buton Modu</p>
                <p className="mb-4 text-sm text-muted-foreground">
                  Etkinleştirildiğinde tam ekran, üç büyük butonlu sade moda geçer:
                  Güvendeyim, Yardım Lazım, Ailemi Ara.
                </p>
                <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={() => setSeniorMode(true)}
                    className={cn(
                      "rounded-xl px-6 py-3 text-sm font-bold transition-colors",
                      seniorMode
                        ? "bg-primary/10 text-primary"
                        : "bg-primary text-primary-foreground hover:bg-primary/90",
                    )}
                  >
                    {seniorMode ? "Yaşlı Modu Açık ✓" : "Yaşlı Modunu Aç"}
                  </button>
                  {!seniorMode && (
                    <Link
                      to="/ayarlar"
                      className="flex items-center gap-1 rounded-xl border border-border px-6 py-3 text-sm font-semibold text-muted-foreground hover:bg-muted/30"
                    >
                      Ayarlardan Yönet
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {seniorMode
                    ? "Yaşlı modu aktif. Çıkmak için ekrandaki güç düğmesini kullan."
                    : "Yaşlı Modunu Aç'a basınca, gerçek büyük butonlu tam ekran modu burada çalışır."}
                </p>
              </div>
            </div>
          )}

          {/* Yaşlı modu tam ekran render */}
          {seniorMode && <SeniorMode onExit={() => setSeniorMode(false)} />}
        </div>
      </div>
    </AppShell>
  );
}

function SectionIntro({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted/40">
        {icon}
      </span>
      <div>
        <h3 className="text-sm font-bold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
