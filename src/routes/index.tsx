import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Phone, ShieldCheck } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { MyStatusPanel } from "@/features/status/components/MyStatusPanel";
import { PulseFeed } from "@/features/status/components/PulseFeed";
import { SosSheet } from "@/features/status/components/SosSheet";
import { StatusComposer } from "@/features/status/components/StatusComposer";
import { QuickCheckDashboard } from "@/features/quickcheck/components/QuickCheckDashboard";
import { ProfileHub } from "@/features/profile/components/ProfileHub";
import { FamilyLocationMap } from "@/features/map/components/FamilyLocationMap";
import { DailyCheckIn } from "@/features/checkin/components/DailyCheckIn";
import { SafetyAlertBanner } from "@/features/alert/components/SafetyAlertBanner";
import { useAppStore } from "@/store/useAppStore";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nabız — Sevdiklerinin anlık hâli" },
      {
        name: "description",
        content:
          "Nabız ile ailenin anlık güvenliğini öğren; acil olduğunda tek dokunuşla yardım iste, sevdiklerin anında görsün.",
      },
      { property: "og:title", content: "Nabız — Aile Güvenlik Platformu" },
      {
        property: "og:description",
        content:
          "Sevdiklerinin anlık güvenliğini bil, 'Ailem Nerede?' haritasıyla izle, tek dokunuşla acil yardım iste.",
      },
    ],
  }),
  component: DashboardPage,
});

/** Ana akış — SOS her şeyin üstünde, güvenlik odaklı sıralama. */
function DashboardPage() {
  const profile = useAppStore((s) => s.profile);
  const openSos = useAppStore((s) => s.openSos);
  const isSenior = profile === "senior";

  return (
    <AppShell>
      <div className="space-y-6 bg-background">
        <h1 className="sr-only">Nabız gösterge paneli</h1>

        {/* Acil durum / önemli aile bildirimi (varsa) */}
        <SafetyAlertBanner />

        {/* 1) Acil durum — her zaman en üstte, tek bakışta görünür */}
        <section className="grid gap-3 sm:grid-cols-3">
          <button
            type="button"
            onClick={openSos}
            className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-sos p-4 text-left text-sos-ink transition-transform active:scale-[0.98] sm:col-span-2"
          >
            <span className="absolute inset-0 pulse-sos" />
            <span className="relative grid h-11 w-11 place-items-center rounded-xl bg-white/15">
              <AlertTriangle className="h-6 w-6" />
            </span>
            <span className="relative">
              <span className="block text-sm font-black uppercase tracking-widest">
                Güvenlik Merkezi
              </span>
              <span className="block text-xs opacity-80">
                Acil durum bildirimi gönder · 112 çağır
              </span>
            </span>
          </button>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
            <Button
              variant="outline"
              onClick={() => window.open("tel:112", "_self")}
              className="h-auto min-h-[64px] justify-start gap-3 rounded-2xl border-red-200 bg-card px-4 text-left hover:bg-red-50"
            >
              <Phone className="h-5 w-5 text-red-500" />
              <span className="leading-tight">
                <span className="block text-sm font-bold">112</span>
                <span className="block text-xs text-muted-foreground">Tüm acil durumlar</span>
              </span>
            </Button>
            <Button
              variant="outline"
              onClick={openSos}
              className="h-auto min-h-[64px] justify-start gap-3 rounded-2xl border-primary/30 bg-card px-4 text-left hover:bg-primary/5"
            >
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span className="leading-tight">
                <span className="block text-sm font-bold">Konum Paylaş</span>
                <span className="block text-xs text-muted-foreground">Güvenlik Merkezi'nde</span>
              </span>
            </Button>
          </div>
        </section>

        {/* 2) Ailem Nerede? — aile güvenliği haritası */}
        <FamilyLocationMap />

        {/* 3) Günlük iyiyim kontrolü */}
        <DailyCheckIn />

        {/* 4) Profile göre öne çıkan araçlar (senior için SeniorMode zaten var) */}
        {!isSenior && <ProfileHub />}

        {/* 5) QuickCheck + akış (senior için sadeleştirildi) */}
        {!isSenior && (
          <>
            <QuickCheckDashboard />
            <MyStatusPanel />
            <PulseFeed />
          </>
        )}
      </div>

      {/* Global paneller: store üzerinden açılır, her yerden erişilebilir. */}
      <StatusComposer />
      <SosSheet />
    </AppShell>
  );
}
