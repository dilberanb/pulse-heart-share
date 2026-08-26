import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  STATUS_CATALOG,
  STATUS_CATEGORIES,
  TONE_STYLES,
  searchStatuses,
} from "@/features/status/data/statusCatalog";
import { usePublishStatus } from "@/features/status/hooks/useStatusFeed";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import type { StatusCategory, StatusOption } from "@/types/status";
import { PrivacySelect } from "./PrivacySelect";

type TabValue = StatusCategory | "all";

/**
 * Durum güncelleme paneli (alt sayfa / bottom sheet).
 * Hedef: minimum sürtünme — arama, kategori sekmeleri ve tek dokunuşla seçim.
 */
export function StatusComposer() {
  const isOpen = useAppStore((s) => s.isComposerOpen);
  const closeComposer = useAppStore((s) => s.closeComposer);
  const defaultPrivacy = useAppStore((s) => s.defaultPrivacy);
  const setDefaultPrivacy = useAppStore((s) => s.setDefaultPrivacy);

  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<TabValue>("all");
  const [selected, setSelected] = useState<StatusOption | null>(null);
  const [note, setNote] = useState("");

  const publish = usePublishStatus();

  /** Arama + kategori filtresinin birleşik sonucu (acil durumlar SOS panelinde). */
  const results = useMemo(() => {
    const base = STATUS_CATALOG.filter((o) => (tab === "all" ? o.category !== "urgent" : o.category === tab));
    return searchStatuses(query, base);
  }, [query, tab]);

  function resetAndClose() {
    closeComposer();
    setQuery("");
    setSelected(null);
    setNote("");
    setTab("all");
  }

  function handlePublish() {
    if (!selected) return;
    publish.mutate(
      { statusId: selected.id, privacy: defaultPrivacy, note: note.trim() || undefined },
      { onSuccess: resetAndClose },
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={(open) => (open ? undefined : resetAndClose())}>
      <SheetContent
        side="bottom"
        className="flex h-[92vh] flex-col gap-0 rounded-t-3xl p-0 sm:h-[88vh]"
      >
        <SheetHeader className="gap-1 px-5 pt-5 pb-3 text-left">
          <SheetTitle className="text-xl">Şu an nasılsın?</SheetTitle>
          <SheetDescription>
            Bir durum seç, sevdiklerin anında görsün. Durumlar 24 saat sonra sona erer.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-3 px-5">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Durum ara: huzurlu, hasta, aranmak istiyor…"
              aria-label="Durum ara"
              className="h-12 rounded-2xl pl-9 text-base"
            />
          </div>

          <Tabs value={tab} onValueChange={(value) => setTab(value as TabValue)}>
            <ScrollArea className="w-full">
              <TabsList className="w-max rounded-full">
                <TabsTrigger value="all" className="rounded-full">
                  Tümü
                </TabsTrigger>
                {STATUS_CATEGORIES.filter((c) => c.id !== "urgent").map((category) => (
                  <TabsTrigger key={category.id} value={category.id} className="rounded-full">
                    <span aria-hidden className="mr-1">
                      {category.emoji}
                    </span>
                    {category.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
          </Tabs>
        </div>

        <ScrollArea className="mt-3 min-h-0 flex-1 px-5">
          {results.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              "{query}" için sonuç yok. Farklı bir kelime dener misin?
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2 pb-4 sm:grid-cols-3 lg:grid-cols-4">
              {results.map((option) => {
                const tone = TONE_STYLES[option.tone];
                const active = selected?.id === option.id;
                return (
                  <motion.button
                    key={option.id}
                    type="button"
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelected(option)}
                    aria-pressed={active}
                    className={cn(
                      "flex min-h-11 items-center gap-2 rounded-2xl border p-3 text-left transition-colors",
                      tone.surface,
                      tone.border,
                      active && "ring-2 ring-ring ring-offset-2 ring-offset-background",
                    )}
                  >
                    <span className="text-2xl leading-none" aria-hidden>
                      {option.emoji}
                    </span>
                    <span className={cn("min-w-0 truncate text-sm font-medium", tone.ink)}>
                      {option.label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <div className="space-y-3 border-t border-border bg-card/60 p-5 pb-6">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_14rem]">
            <div className="space-y-1.5">
              <Label htmlFor="status-note">Kısa not (opsiyonel)</Label>
              <Textarea
                id="status-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={2}
                maxLength={140}
                placeholder="Eklemek istediğin bir şey var mı?"
                className="resize-none rounded-2xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="privacy">Kimler görsün?</Label>
              <PrivacySelect
                value={defaultPrivacy}
                onChange={setDefaultPrivacy}
                className="h-11 w-full rounded-2xl"
                ariaLabel="Durumu kimler görsün"
              />
            </div>
          </div>

          <Button
            size="lg"
            className="h-12 w-full gap-2 rounded-2xl text-base"
            disabled={!selected || publish.isPending}
            onClick={handlePublish}
          >
            <Send className="h-4 w-4" />
            {selected ? `${selected.emoji} ${selected.label} olarak paylaş` : "Bir durum seç"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
