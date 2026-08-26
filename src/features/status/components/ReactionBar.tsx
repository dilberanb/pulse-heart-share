import { Coffee, Heart, HeartHandshake } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ReactionKind, StatusEntry } from "@/types/status";

/** Tek dokunuş empati seçenekleri (metin yorumu yok — bilinçli bir tasarım kararı). */
const REACTIONS: { kind: ReactionKind; label: string; Icon: typeof Heart }[] = [
  { kind: "hug", label: "Sanal sarılma", Icon: HeartHandshake },
  { kind: "heart", label: "Kalp", Icon: Heart },
  { kind: "coffee", label: "Kahve ısmarla", Icon: Coffee },
];

interface ReactionBarProps {
  entry: StatusEntry;
  onReact: (kind: ReactionKind) => void;
}

export function ReactionBar({ entry, onReact }: ReactionBarProps) {
  return (
    <div className="flex items-center gap-1">
      {REACTIONS.map(({ kind, label, Icon }) => {
        const active = entry.myReactions.includes(kind);
        const count = entry.reactions[kind];

        return (
          <Tooltip key={kind}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                aria-label={label}
                aria-pressed={active}
                onClick={() => onReact(kind)}
                className={cn(
                  "h-8 min-w-10 gap-1.5 rounded-lg px-2 text-xs transition-transform active:scale-95",
                  active && "bg-primary/10 font-semibold text-primary",
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", active && "fill-current")} />
                {count > 0 && <span className="tabular-nums">{count}</span>}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{label}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
}
