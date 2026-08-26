import { AnimatePresence } from "motion/react";

import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { isActive } from "@/features/status/api/mockApi";
import { PrivacySelect } from "@/features/status/components/PrivacySelect";
import { StatusCard } from "@/features/status/components/StatusCard";
import { useNudge, useStatusFeed, useToggleReaction } from "@/features/status/hooks/useStatusFeed";
import { useAppStore } from "@/store/useAppStore";
import type { StatusEntry } from "@/types/status";

export function PulseFeed() {
  const circle = useAppStore((s) => s.circle);
  const setCircle = useAppStore((s) => s.setCircle);
  const onlyActive = useAppStore((s) => s.onlyActive);
  const setOnlyActive = useAppStore((s) => s.setOnlyActive);

  const { data: entries, isLoading } = useStatusFeed();
  const react = useToggleReaction();
  const nudge = useNudge();

  const sorted = entries
    ? [...entries].sort((a: StatusEntry, b: StatusEntry) => {
        if (a.status.category === "urgent" && b.status.category !== "urgent") return -1;
        if (a.status.category !== "urgent" && b.status.category === "urgent") return 1;
        return 0;
      })
    : undefined;

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h2 className="truncate text-base font-semibold tracking-tight text-foreground">
            Nabız Akışı
          </h2>
          <p className="truncate text-xs text-muted-foreground">
            Durumlar 24 saat sonra sona erer.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <Switch id="only-active" checked={onlyActive} onCheckedChange={setOnlyActive} />
            <Label htmlFor="only-active" className="text-xs text-muted-foreground">
              Sadece aktif
            </Label>
          </div>
          <PrivacySelect
            value={circle}
            onChange={setCircle}
            ariaLabel="Çembere göre filtrele"
            className="h-9 w-40 rounded-lg text-xs"
          />
        </div>
      </header>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-44 rounded-xl" />
          ))}
        </div>
      ) : sorted && sorted.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence initial={false}>
            {sorted.map((entry) => (
              <StatusCard
                key={entry.id}
                entry={entry}
                isStale={!isActive(entry)}
                onReact={(kind) => react.mutate({ entryId: entry.id, kind })}
                onNudge={() => nudge.mutate(entry.person.id)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
          <p className="text-sm font-medium text-foreground">Bu çemberde güncel durum yok.</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Filtreyi değiştir ya da sevdiklerine bir yoklama gönder.
          </p>
        </div>
      )}
    </section>
  );
}
