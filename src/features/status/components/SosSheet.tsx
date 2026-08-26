import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { URGENT_STATUSES } from "@/features/status/data/statusCatalog";
import { usePublishStatus } from "@/features/status/hooks/useStatusFeed";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { StatusOption } from "@/types/status";

/**
 * Acil durum (SOS) paneli.
 * Normal UI kalıplarını bilinçli olarak kırar: yüksek kontrast, büyük hedefler,
 * gizlilik seçimi yok — acil durumlar her zaman tüm çemberlere gider.
 */
export function SosSheet() {
  const isOpen = useAppStore((s) => s.isSosOpen);
  const closeSos = useAppStore((s) => s.closeSos);
  const publish = usePublishStatus();
  const [pendingId, setPendingId] = useState<string | null>(null);

  function handleSelect(option: StatusOption) {
    setPendingId(option.id);
    publish.mutate(
      { statusId: option.id, privacy: "everyone" },
      { onSuccess: closeSos, onSettled: () => setPendingId(null) },
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? undefined : closeSos())}>
      <SheetContent side="bottom" className="rounded-t-3xl border-t-4 border-mood-urgent">
        <SheetHeader className="text-left">
          <SheetTitle className="flex items-center gap-2 text-mood-urgent-ink">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            Acil durum bildir
          </SheetTitle>
          <SheetDescription>
            Bu bildirim tüm çemberlerine anında ve öncelikli olarak gönderilir.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-2 px-4 pb-6 sm:grid-cols-2">
          {URGENT_STATUSES.map((option) => (
            <Button
              key={option.id}
              variant="outline"
              size="lg"
              disabled={publish.isPending}
              onClick={() => handleSelect(option)}
              className={cn(
                "h-14 justify-start gap-3 rounded-2xl border-2 border-mood-urgent/60 bg-mood-urgent-surface text-base font-semibold text-mood-urgent-ink",
                "hover:bg-mood-urgent-surface/80",
                pendingId === option.id && "opacity-70",
              )}
            >
              <span className="text-2xl" aria-hidden>
                {option.emoji}
              </span>
              {option.label}
            </Button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
