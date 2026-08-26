import { AnimatePresence } from "motion/react";

import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { isActive } from "@/features/status/api/mockApi";
import { PrivacySelect } from "@/features/status/components/PrivacySelect";
import { StatusCard } from "@/features/status/components/StatusCard";
import { useNudge, useStatusFeed, useToggleReaction } from "@/features/status/hooks/useStatusFeed";
import { useAppStore } from "@/store/useAppStore";

/**
 * "Nabız" akışı — bağlı kişilerin güncel durumları.
 * Bilinçli olarak sonsuz kaydırma / algoritma yoktur: sonlu, sakin bir liste.
 */
export function PulseFeed() {
  const circle = useAppStore((s) => s.circle);
  const setCircle = useAppStore((s) => s.setCircle);
  const onlyActive = useAppStore((s) => s.onlyActive);
  const setOnlyActive = useAppStore((s) => s.setOnlyActive);

  const { data: entries, isLoading } = useStatusFeed();
  const react = useToggleReaction();
  const nudge = useNudge();

  return (
    <section className="space-y-4">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold tracking-tight">Sevdiklerinin nabzı</h2>
          <p className="truncate text-sm text-muted-foreground">
            Durumlar 24 saat sonra sessizce sona erer.
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
            className="h-10 w-44 rounded-2xl"
          />
        </div>
      </header>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-52 rounded-3xl" />
          ))}
        </div>
      ) : entries && entries.length > 0 ? (
        // Masonry benzeri yerleşim: kart yükseklikleri serbest, boşluk oluşmaz.
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
          <AnimatePresence initial={false}>
            {entries.map((entry) => (
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
        <div className="rounded-3xl border border-dashed border-border p-10 text-center">
          <p className="text-sm font-medium">Bu çemberde güncel durum yok.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Filtreyi değiştir ya da sevdiklerine bir yoklama gönder.
          </p>
        </div>
      )}
    </section>
  );
}
