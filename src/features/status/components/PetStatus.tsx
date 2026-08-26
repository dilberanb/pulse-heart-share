import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, PawPrint, Send, ChevronDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PET_STATUSES } from "@/features/status/data/statusCatalog";
import { usePublishStatus } from "@/features/status/hooks/useStatusFeed";
import { cn } from "@/lib/utils";
import type { StatusOption } from "@/types/status";

interface PetProfile {
  name: string;
  species: string;
  breed?: string;
  avatarUrl?: string;
  age?: string;
}

interface PetStatusProps {
  pet: PetProfile;
  currentStatus?: StatusOption;
  className?: string;
}

const SPECIES_EMOJI: Record<string, string> = {
  Köpek: "🐕",
  Kedi: "🐦",
  Kuş: "🐦",
  Balık: "🐟",
  Kaplumbağa: "🐢",
  Tavşan: "🐇",
  Hamster: "🐹",
  Diğer: "🐾",
};

export function PetStatus({ pet, currentStatus, className }: PetStatusProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selected, setSelected] = useState<StatusOption | null>(null);
  const publish = usePublishStatus();

  const speciesEmoji = SPECIES_EMOJI[pet.species] || "🐾";

  function handlePublish() {
    if (!selected) return;
    publish.mutate(
      { statusId: selected.id, privacy: "everyone" },
      {
        onSuccess: () => {
          setSelected(null);
          setIsExpanded(false);
        },
      },
    );
  }

  function handleEmergency() {
    publish.mutate(
      { statusId: "petemergency", privacy: "everyone", note: `${pet.name} için acil durum!` },
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
            {pet.avatarUrl ? (
              <img
                src={pet.avatarUrl}
                alt={pet.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              speciesEmoji
            )}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="flex items-center gap-2 text-base">
              <PawPrint className="h-4 w-4 shrink-0" />
              {pet.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {pet.species}
              {pet.breed ? ` · ${pet.breed}` : ""}
              {pet.age ? ` · ${pet.age}` : ""}
            </p>
          </div>
          {currentStatus && (
            <Badge variant="secondary" className="gap-1 rounded-full">
              <span>{currentStatus.emoji}</span>
              <span className="text-xs">{currentStatus.label}</span>
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {currentStatus && (
          <div className="rounded-2xl border border-border bg-muted/30 p-3">
            <p className="text-sm text-muted-foreground">Şu anki durum:</p>
            <p className="mt-1 font-semibold">
              {currentStatus.emoji} {currentStatus.label}
            </p>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between rounded-xl"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className="flex items-center gap-2">
            <PawPrint className="h-4 w-4" />
            Durum güncelle
          </span>
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
          />
        </Button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <ScrollArea className="max-h-[240px]">
                <div className="grid grid-cols-2 gap-2 pb-2">
                  {PET_STATUSES.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelected(option)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border p-2.5 text-left text-sm transition-colors",
                        selected?.id === option.id
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-border hover:bg-muted/50",
                      )}
                    >
                      <span className="text-lg">{option.emoji}</span>
                      <span className="truncate font-medium">{option.label}</span>
                    </button>
                  ))}
                </div>
              </ScrollArea>

              {selected && (
                <Button
                  size="sm"
                  className="mt-2 w-full gap-2 rounded-xl"
                  disabled={publish.isPending}
                  onClick={handlePublish}
                >
                  <Send className="h-3.5 w-3.5" />
                  {selected.emoji} {selected.label} olarak paylaş
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          variant="destructive"
          size="sm"
          className="w-full gap-2 rounded-xl"
          onClick={handleEmergency}
          disabled={publish.isPending}
        >
          <AlertTriangle className="h-4 w-4" />
          Acil Durum Bildir
        </Button>
      </CardContent>
    </Card>
  );
}
