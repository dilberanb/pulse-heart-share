import { Globe, Lock, Users } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CIRCLE_LABELS } from "@/store/useAppStore";
import type { PrivacyCircle } from "@/types/status";

const ICONS: Record<PrivacyCircle, typeof Globe> = {
  everyone: Globe,
  close: Users,
  inner: Lock,
};

const ORDER: PrivacyCircle[] = ["everyone", "close", "inner"];

interface PrivacySelectProps {
  value: PrivacyCircle;
  onChange: (value: PrivacyCircle) => void;
  /** Filtre modunda "Herkes" seçeneği "tümü" anlamına gelir. */
  ariaLabel?: string;
  className?: string;
}

/** Gizlilik çemberi seçici — hem yayınlama hem filtreleme için kullanılır. */
export function PrivacySelect({ value, onChange, ariaLabel, className }: PrivacySelectProps) {
  return (
    <Select value={value} onValueChange={(next) => onChange(next as PrivacyCircle)}>
      <SelectTrigger className={className} aria-label={ariaLabel ?? "Gizlilik çemberi"}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ORDER.map((circle) => {
          const Icon = ICONS[circle];
          return (
            <SelectItem key={circle} value={circle}>
              <span className="flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0" />
                {CIRCLE_LABELS[circle]}
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
