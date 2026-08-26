import { motion } from "motion/react";
import { BellRing, Clock, Lock, Users } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TONE_STYLES } from "@/features/status/data/statusCatalog";
import { cn } from "@/lib/utils";
import { expiresInTr, initials, relativeTimeTr } from "@/lib/time";
import type { ReactionKind, StatusEntry } from "@/types/status";
import { ReactionBar } from "./ReactionBar";

interface StatusCardProps {
  entry: StatusEntry;
  /** 24 saatlik efemer pencere dışında mı? */
  isStale: boolean;
  onReact: (kind: ReactionKind) => void;
  onNudge: () => void;
}

/**
 * Feed'deki tek bir kişi kartı.
 * Sorumluluğu yalnızca sunumdur; veri getirme/mutasyon üst katmanda yaşar.
 */
export function StatusCard({ entry, isStale, onReact, onNudge }: StatusCardProps) {
  const tone = TONE_STYLES[entry.status.tone];
  const isUrgent = entry.status.category === "urgent";
  const expiry = expiresInTr(entry.createdAt);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: isStale ? 0.62 : 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
      className={cn(
        "rounded-3xl border p-5 shadow-[var(--shadow-soft)]",
        tone.surface,
        tone.border,
        isUrgent && "pulse-urgent border-2",
      )}
    >
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-11 w-11 shrink-0 border border-border/60">
            <AvatarImage src={entry.person.avatarUrl} alt="" />
            <AvatarFallback className="text-sm font-semibold">
              {initials(entry.person.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className={cn("truncate text-base font-semibold", tone.ink)}>{entry.person.name}</p>
            <p className={cn("truncate text-xs opacity-80", tone.ink)}>{entry.person.relation}</p>
          </div>
        </div>

        <span className={cn("text-5xl leading-none", isUrgent && "animate-pulse")} aria-hidden>
          {entry.status.emoji}
        </span>
      </header>

      <div className="mt-4">
        <p className={cn("text-xl font-semibold tracking-tight", tone.ink)}>
          {entry.status.label}
        </p>
        {entry.note && (
          <p className={cn("mt-1.5 text-sm leading-relaxed opacity-90", tone.ink)}>{entry.note}</p>
        )}
      </div>

      <div className={cn("mt-4 flex flex-wrap items-center gap-2 text-xs", tone.ink)}>
        <span className="inline-flex items-center gap-1 opacity-80">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          {relativeTimeTr(entry.createdAt)}
        </span>
        <Badge variant="outline" className={cn("gap-1 border-current/30 bg-background/40", tone.ink)}>
          {entry.privacy === "inner" ? (
            <Lock className="h-3 w-3" />
          ) : (
            <Users className="h-3 w-3" />
          )}
          {entry.privacy === "inner" ? "Çekirdek" : entry.privacy === "close" ? "Yakın" : "Herkes"}
        </Badge>
        {!isStale && expiry && <span className="opacity-70">· {expiry}</span>}
      </div>

      {/* Efemer durum: 24 saatten eski kayıtlar nazik bir yoklama daveti gösterir. */}
      {isStale ? (
        <div className="mt-4 rounded-2xl border border-border/60 bg-background/60 p-3">
          <p className="text-sm font-medium text-foreground">Bugün haber yok. İyi misin?</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Son güncelleme 24 saatten eski, bu yüzden soluklaştı.
          </p>
          <Button variant="secondary" size="sm" className="mt-3 gap-2 rounded-full" onClick={onNudge}>
            <BellRing className="h-4 w-4" />
            Nabız yokla
          </Button>
        </div>
      ) : (
        <footer className="mt-4 flex items-center justify-between border-t border-current/10 pt-2">
          <ReactionBar entry={entry} onReact={onReact} />
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-1.5 rounded-full text-xs"
            onClick={onNudge}
          >
            <BellRing className="h-4 w-4" />
            Yokla
          </Button>
        </footer>
      )}
    </motion.article>
  );
}
