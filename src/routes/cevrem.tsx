import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/layout/AppShell";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MOCK_PEOPLE } from "@/features/status/api/mockApi";
import { SosSheet } from "@/features/status/components/SosSheet";
import { StatusComposer } from "@/features/status/components/StatusComposer";
import { initials } from "@/lib/time";
import { CIRCLE_LABELS } from "@/store/useAppStore";

export const Route = createFileRoute("/cevrem")({
  head: () => ({
    meta: [
      { title: "Çevrem — Nabız" },
      {
        name: "description",
        content: "Gizlilik çemberlerini yönet: çekirdek aile ve yakın arkadaşlar.",
      },
      { property: "og:title", content: "Çevrem — Nabız" },
      {
        property: "og:description",
        content: "Nabız'da kimin hangi durumları göreceğini çemberlerle belirle.",
      },
    ],
  }),
  component: CirclesPage,
});

/** Gizlilik çemberleri özeti (Phase 1: salt okunur liste). */
function CirclesPage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold tracking-tight">Çevrem</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Durumlarını kimin göreceğini çemberler belirler.
          </p>
        </header>

        <ul className="grid gap-3 sm:grid-cols-2">
          {MOCK_PEOPLE.map((person) => (
            <li
              key={person.id}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-3xl border border-border bg-card p-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarFallback>{initials(person.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-medium">{person.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{person.relation}</p>
                </div>
              </div>
              <Badge variant="secondary" className="shrink-0">
                {CIRCLE_LABELS[person.circle]}
              </Badge>
            </li>
          ))}
        </ul>
      </div>

      <StatusComposer />
      <SosSheet />
    </AppShell>
  );
}
