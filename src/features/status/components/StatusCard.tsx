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
  isStale: boolean;
  onReact: (kind: ReactionKind) => void;
  onNudge: () => void;
}

export function StatusCard({ entry, isStale, onReact, onNudge }: StatusCardProps) {
  const tone = TONE_STYLES[entry.status.tone];
  const isUrgent = entry.status.category === "urgent";
  const expiry = expiresInTr(entry.createdAt);

  if (isUrgent) {
    return (
      <motion.article
        layout
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="relative overflow-hidden rounded-xl border-2 border-sos bg-sos p-5 text-sos-ink pulse-urgent"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        <div className="relative">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 shrink-0 border-2 border-white/30">
                <AvatarImage src={entry.person.avatarUrl} alt="" />
                <AvatarFallback className="bg-white/20 text-xs font-bold">
                  {initials(entry.person.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold">{entry.person.name}</p>
                <p className="text-xs opacity-80">{relativeTimeTr(entry.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider opacity-80">ACİL</span>
              <span className="text-2xl">{entry.status.emoji}</span>
            </div>
          </header>

          <div className="mt-3">
            <p className="text-lg font-bold">{entry.status.label}</p>
            {entry.note && <p className="mt-1 text-sm opacity-90">{entry.note}</p>}
          </div>

          <footer className="mt-4 flex items-center justify-between border-t border-white/20 pt-3">
            <ReactionBar entry={entry} onReact={onReact} />
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 rounded-lg text-xs text-white/90 hover:bg-white/15 hover:text-white"
              onClick={onNudge}
            >
              <BellRing className="h-3.5 w-3.5" />
              Yokla
            </Button>
          </footer>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: isStale ? 0.55 : 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className={cn(
        "rounded-xl border bg-card p-4 shadow-[var(--shadow-soft)]",
        tone.border,
      )}
    >
      <header className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={entry.person.avatarUrl} alt="" />
            <AvatarFallback className="text-xs font-semibold">
              {initials(entry.person.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{entry.person.name}</p>
            <p className="truncate text-xs text-muted-foreground">{entry.person.relation}</p>
          </div>
        </div>
        <span className="text-xl leading-none" aria-hidden>
          {entry.status.emoji}
        </span>
      </header>

      <div className="mt-3">
        <p className="text-base font-semibold text-foreground">{entry.status.label}</p>
        {entry.note && (
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{entry.note}</p>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3 shrink-0" />
          {relativeTimeTr(entry.createdAt)}
        </span>
        <Badge variant="outline" className="gap-1 text-xs">
          {entry.privacy === "inner" ? (
            <Lock className="h-2.5 w-2.5" />
          ) : (
            <Users className="h-2.5 w-2.5" />
          )}
          {entry.privacy === "inner" ? "Çekirdek" : entry.privacy === "close" ? "Yakın" : "Herkes"}
        </Badge>
        {!isStale && expiry && <span className="opacity-60">· {expiry}</span>}
      </div>

      {isStale ? (
        <div className="mt-3 rounded-lg border border-dashed border-border bg-muted/50 p-3">
          <p className="text-sm font-medium text-foreground">Bugün haber yok. İyi misin?</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Son güncelleme 24 saatten eski.
          </p>
          <Button variant="secondary" size="sm" className="mt-2.5 gap-1.5 rounded-lg text-xs" onClick={onNudge}>
            <BellRing className="h-3.5 w-3.5" />
            Nabız yokla
          </Button>
        </div>
      ) : (
        <footer className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
          <ReactionBar entry={entry} onReact={onReact} />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 rounded-lg text-xs"
            onClick={onNudge}
          >
            <BellRing className="h-3.5 w-3.5" />
            Yokla
          </Button>
        </footer>
      )}
    </motion.article>
  );
}
