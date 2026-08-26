import { motion } from "motion/react";
import { Battery, BatteryLow, Clock, MapPin, Phone, Send } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { initials, relativeTimeTr } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { FamilyMemberStatus } from "@/types/quickcheck";

interface QuickCheckCardProps {
  member: FamilyMemberStatus;
  onSendCheck: () => void;
  onCall: () => void;
  onViewLocation: () => void;
}

const STATUS_DOT: Record<FamilyMemberStatus["status"], string> = {
  safe: "bg-emerald-500",
  busy: "bg-amber-500",
  problem: "bg-red-500",
  pending: "bg-amber-400 animate-pulse",
  unknown: "bg-zinc-500",
};

const STATUS_BG: Record<FamilyMemberStatus["status"], string> = {
  safe: "border-emerald-500/20",
  busy: "border-amber-500/20",
  problem: "border-red-500/25",
  pending: "border-amber-400/20",
  unknown: "border-zinc-500/20",
};

function BatteryIndicator({ level }: { level: number }) {
  const isLow = level <= 20;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs tabular-nums",
        isLow ? "text-red-400" : "text-muted-foreground",
      )}
    >
      {isLow ? (
        <BatteryLow className="h-3.5 w-3.5" />
      ) : (
        <Battery className="h-3.5 w-3.5" />
      )}
      {level}%
    </span>
  );
}

export function QuickCheckCard({
  member,
  onSendCheck,
  onCall,
  onViewLocation,
}: QuickCheckCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className={cn(
        "rounded-xl border bg-card p-4 shadow-[var(--shadow-soft)]",
        STATUS_BG[member.status],
      )}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-11 w-11 shrink-0">
            <AvatarImage src={member.avatarUrl} alt="" />
            <AvatarFallback className="text-sm font-semibold">
              {initials(member.name)}
            </AvatarFallback>
          </Avatar>
          <span
            className={cn(
              "absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-card",
              STATUS_DOT[member.status],
            )}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{member.name}</p>
          <p className="truncate text-xs text-muted-foreground">{member.relation}</p>
        </div>
        <div className="text-right">
          <p
            className={cn(
              "text-xs font-medium",
              member.status === "problem"
                ? "text-red-400"
                : member.status === "pending"
                  ? "text-amber-400"
                  : member.status === "safe"
                    ? "text-emerald-400"
                    : "text-muted-foreground",
            )}
          >
            {member.statusLabel}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        <BatteryIndicator level={member.batteryLevel} />
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3 w-3 shrink-0" />
          {relativeTimeTr(member.lastSeenAt)}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
        <Button
          variant="default"
          size="sm"
          className="h-8 flex-1 gap-1.5 rounded-lg text-xs"
          onClick={onSendCheck}
        >
          <Send className="h-3.5 w-3.5" />
          QuickCheck Gönder
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 rounded-lg text-xs"
          onClick={onCall}
        >
          <Phone className="h-3.5 w-3.5" />
          Ara
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 rounded-lg text-xs"
          onClick={onViewLocation}
        >
          <MapPin className="h-3.5 w-3.5" />
          Konumunu Gör
        </Button>
      </div>
    </motion.div>
  );
}
