import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bell, CheckCircle2, Home, PawPrint, Utensils, AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePublishStatus } from "@/features/status/hooks/useStatusFeed";
import { cn } from "@/lib/utils";

interface PetCarePanelProps {
  petName: string;
  className?: string;
}

/**
 * Evcil hayvan sahibi için hızlı, işlevsel durum bildirimleri:
 * "Evde değilim", "(isim) evde tek", "Beslenmesi gerek" ve "Kayboldu".
 * Her buton bir gerçek durum (status) yayınlar; kayıp akışı ayrı panelde.
 */
export function PetCarePanel({ petName, className }: PetCarePanelProps) {
  const [activating, setActivating] = useState<string | null>(null);
  const publish = usePublishStatus();

  const action = (id: string, label: string) => {
    setActivating(id);
    publish.mutate(
      { statusId: id, privacy: "everyone", note: `${petName} için durum güncellendi.` },
      { onSettled: () => setActivating(null) },
    );
  };

  const items = [
    { id: "pethome", label: "Evde değilim", icon: Home, tone: "border-border hover:bg-muted/50" },
    { id: "petalone", label: `${petName} evde tek`, icon: PawPrint, tone: "border-border hover:bg-muted/50" },
    { id: "petneedfood", label: "Beslenmesi gerek", icon: Utensils, tone: "border-amber-300 bg-amber-50/50 hover:bg-amber-50" },
  ] as const;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-4 w-4 text-amber-500" />
          Hızlı Durum Bildirimleri
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {petName} hakkında çevrene ve ailene anında bilgi ver.
        </p>
      </CardHeader>

      <CardContent className="space-y-2">
        <AnimatePresence>
          {items.map((it) => (
            <motion.button
              key={it.id}
              type="button"
              whileTap={{ scale: 0.98 }}
              onClick={() => action(it.id, it.label)}
              disabled={activating === it.id || publish.isPending}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm font-semibold transition-colors disabled:opacity-60",
                it.tone,
              )}
            >
              <it.icon className="h-5 w-5 shrink-0" />
              <span className="flex-1">{it.label}</span>
              {activating === it.id ? (
                <Downloading />
              ) : (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-muted-foreground" />
              )}
            </motion.button>
          ))}
        </AnimatePresence>

        <div className="flex items-start gap-2 rounded-xl border border-dashed border-muted p-3 text-xs text-muted-foreground">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
          <p>
            Eğer {petName} kaybolduysa, aşağıdaki <strong>Kayıp İlanı</strong> bölümünden hemen
            paylaşıma hazır kimlik kartı oluştur.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function Downloading() {
  return (
    <span className="h-4 w-4 shrink-0 animate-pulse rounded-full border-2 border-amber-500 border-t-transparent" />
  );
}
