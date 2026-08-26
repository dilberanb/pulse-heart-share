import { Phone } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  EMERGENCY_NUMBERS,
  type EmergencyNumber,
} from "@/features/emergency/data/emergencyNumbers";

function HotlineCard({ number }: { number: EmergencyNumber }) {
  const Icon = number.icon;
  const isPrimary = number.category === "primary";

  return (
    <a
      href={number.telHref}
      className={cn(
        "group flex items-center gap-4 rounded-2xl border p-4 transition-colors",
        isPrimary
          ? "border-red-200 bg-red-50 hover:bg-red-100 dark:border-red-900 dark:bg-red-950 dark:hover:bg-red-900/60"
          : "border-border bg-card hover:bg-accent",
      )}
    >
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
          isPrimary
            ? "bg-red-500 text-white"
            : "bg-primary/10 text-primary",
        )}
      >
        <Icon className="h-6 w-6" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold">{number.name}</p>
        <p className="truncate text-xs text-muted-foreground">{number.description}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span
          className={cn(
            "rounded-full px-3 py-1 text-sm font-bold tabular-nums",
            isPrimary
              ? "bg-red-500/10 text-red-600 dark:text-red-400"
              : "bg-primary/10 text-primary",
          )}
        >
          {number.phone}
        </span>
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Phone className="h-3 w-3" />
          Tek dokunuşla ara
        </span>
      </div>
    </a>
  );
}

export function EmergencyHotlines() {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold">Acil Durum Hatları</h2>
      <p className="text-sm text-muted-foreground">
        Numaraya dokunarak doğrudan arama yapabilirsin.
      </p>
      <div className="space-y-2">
        {EMERGENCY_NUMBERS.map((num) => (
          <HotlineCard key={num.id} number={num} />
        ))}
      </div>
    </section>
  );
}
