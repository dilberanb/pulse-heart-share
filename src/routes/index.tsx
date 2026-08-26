import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/AppShell";
import { MyStatusPanel } from "@/features/status/components/MyStatusPanel";
import { PulseFeed } from "@/features/status/components/PulseFeed";
import { SosSheet } from "@/features/status/components/SosSheet";
import { StatusComposer } from "@/features/status/components/StatusComposer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nabız — Sevdiklerinin anlık hâli" },
      {
        name: "description",
        content:
          "Nabız ile duygusal, bedensel ve durumsal hâlini tek dokunuşla paylaş; sevdiklerin anında görsün.",
      },
      { property: "og:title", content: "Nabız — Sevdiklerinin anlık hâli" },
      {
        property: "og:description",
        content: "Sakin, empatik bir durum paylaşma alanı. 100+ mikro-durum, gizlilik çemberleri, SOS.",
      },
    ],
  }),
  component: DashboardPage,
});

/** Canlı gösterge paneli (Nabız akışı) — Phase 1 MVP ana ekranı. */
function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <h1 className="sr-only">Nabız gösterge paneli</h1>
        <MyStatusPanel />
        <PulseFeed />
      </div>

      {/* Global paneller: store üzerinden açılır, her yerden erişilebilir. */}
      <StatusComposer />
      <SosSheet />
    </AppShell>
  );
}
