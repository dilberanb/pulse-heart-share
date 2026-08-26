import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TONE_STYLES } from "@/features/status/data/statusCatalog";
import { useMyStatus } from "@/features/status/hooks/useStatusFeed";
import { relativeTimeTr } from "@/lib/time";
import { cn } from "@/lib/utils";
import { CIRCLE_LABELS, useAppStore } from "@/store/useAppStore";

/** Kullanıcının kendi durumunu gösteren ve güncellemeye davet eden üst panel. */
export function MyStatusPanel() {
  const { data: myStatus, isLoading } = useMyStatus();
  const openComposer = useAppStore((s) => s.openComposer);

  if (isLoading) {
    return <Skeleton className="h-28 w-full rounded-3xl" />;
  }

  const tone = myStatus ? TONE_STYLES[myStatus.status.tone] : null;

  return (
    <section
      className={cn(
        "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-3xl border p-5 shadow-[var(--shadow-soft)]",
        tone ? cn(tone.surface, tone.border) : "border-border bg-card",
      )}
    >
      <div className="flex min-w-0 items-center gap-4">
        <span className="text-4xl leading-none" aria-hidden>
          {myStatus?.status.emoji ?? "✨"}
        </span>
        <div className="min-w-0">
          <p className={cn("text-xs font-medium opacity-80", tone?.ink)}>Senin durumun</p>
          <p className={cn("truncate text-lg font-semibold", tone?.ink)}>
            {myStatus ? myStatus.status.label : "Henüz bir durum paylaşmadın"}
          </p>
          {myStatus && (
            <p className={cn("truncate text-xs opacity-80", tone?.ink)}>
              {relativeTimeTr(myStatus.createdAt)} · {CIRCLE_LABELS[myStatus.privacy]}
            </p>
          )}
        </div>
      </div>

      <Button onClick={openComposer} className="h-11 gap-2 rounded-2xl">
        <Pencil className="h-4 w-4" />
        Güncelle
      </Button>
    </section>
  );
}
