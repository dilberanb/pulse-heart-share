import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/AppShell";
import { MissingPanel } from "@/features/missing/components/MissingPanel";

export const Route = createFileRoute("/kayip")({
  head: () => ({
    meta: [
      { title: "Kayıp İlanı — Nabız" },
      {
        name: "description",
        content:
          "Aile üyesi ya da evcil hayvan kaybolduğunda paylaşıma hazır kimlik kartı oluştur ve hemen sosyal medyada ya da yetkililere ilet.",
      },
    ],
  }),
  component: MissingPage,
});

function MissingPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Kayıp İlanı</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Aile üyesi ya da evcil hayvan kaybolduğunda, saniyeler içinde paylaşıma hazır kimlik
            kartı oluştur; sosyal medyada ya da yetkililerde kullan.
          </p>
        </header>

        <MissingPanel />
      </div>
    </AppShell>
  );
}
