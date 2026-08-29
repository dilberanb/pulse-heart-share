import { AnimatePresence, motion } from "motion/react";
import { Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useStatusFeed } from "@/features/status/hooks/useStatusFeed";

/**
 * Güvenlik uyarı bannerı — aile üyelerinden acil / tıbbi bir durum
 * geldiğinde dikkat çeker. Aile güvenliği platformunun "alıcı" yüzü:
 * biri acil paylaştığında senin öğrenmen gerekir.
 * (Web MVP: feed'deki acil/tıbbi durumlardan beslenir.)
 */
export function SafetyAlertBanner() {
  const { data: feed } = useStatusFeed();

  // Acil veya tıbbi-soslu bir aile durumu var mı?
  const alertEntry = (feed ?? []).find(
    (e) => e.person.id !== "me" && (e.status.category === "urgent" || e.status.id === "medical"),
  );

  if (!alertEntry) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        className="rounded-2xl border-2 border-red-300/50 bg-red-500/10 p-4"
      >
        <div className="flex items-start gap-3">
          <span className="shrink-0 grid h-10 w-10 place-items-center rounded-full bg-red-500/20 text-xl">
            {alertEntry.person.name[0]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-red-700">
              {alertEntry.person.name} bir durum paylaştı
            </p>
            <p className="mt-0.5 text-sm text-red-900/80">
              {alertEntry.status.emoji} {alertEntry.status.label}
              {alertEntry.note ? ` — "${alertEntry.note}"` : ""}
            </p>
            <p className="mt-0.5 text-xs text-red-700/70">
              {alertEntry.person.relation} · Bu önemli olabilir, kontrol etmek ister misin?
            </p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <Button
            onClick={() => window.open(`tel:112`, "_self")}
            className="h-11 flex-1 bg-red-600 hover:bg-red-700"
          >
            <Phone className="mr-1.5 h-4 w-4" />
            Hemen Ulaş
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open("tel:112", "_self")}
            className="h-11 flex-1 border-red-300 text-red-700 hover:bg-red-500/10"
          >
            Acil Yardım Çağır
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
