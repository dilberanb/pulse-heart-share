import { Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyStatus } from "@/features/status/hooks/useStatusFeed";
import { relativeTimeTr } from "@/lib/time";
import { CIRCLE_LABELS, useAppStore } from "@/store/useAppStore";

export function MyStatusPanel() {
  const { data: myStatus, isLoading } = useMyStatus();
  const openComposer = useAppStore((s) => s.openComposer);

  if (isLoading) {
    return <Skeleton className="h-20 w-full rounded-xl" />;
  }

  return (
    <section className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3.5 shadow-[var(--shadow-soft)]">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-lg" aria-hidden>
          {myStatus?.status.emoji ?? "✨"}
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Durumun
          </p>
          <p className="truncate text-sm font-semibold text-foreground">
            {myStatus ? myStatus.status.label : "Henüz durum paylaşmadın"}
          </p>
          {myStatus && (
            <p className="truncate text-[11px] text-muted-foreground">
              {relativeTimeTr(myStatus.createdAt)} · {CIRCLE_LABELS[myStatus.privacy]}
            </p>
          )}
        </div>
      </div>

      <Button
        onClick={openComposer}
        size="sm"
        className="h-9 shrink-0 gap-1.5 rounded-lg text-xs"
      >
        <Pencil className="h-3.5 w-3.5" />
        Güncelle
      </Button>
    </section>
  );
}
