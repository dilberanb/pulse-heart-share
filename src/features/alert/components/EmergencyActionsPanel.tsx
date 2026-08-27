import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  MapPin,
  Bell,
  BellRing,
  Send,
  Smartphone,
  Navigation,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EMERGENCY_ACTIONS, type EmergencyAction } from "@/features/alert/types";
import { MOCK_PEOPLE } from "@/features/status/api/mockApi";
import { toast } from "sonner";

interface SelectedPerson {
  id: string;
  name: string;
}

export function EmergencyActionsPanel({ className }: { className?: string }) {
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [selectedPeople, setSelectedPeople] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const action = EMERGENCY_ACTIONS.find((a) => a.id === selectedActionId) ?? null;
  const includeLocation =
    action?.behavior === "location" || action?.behavior === "location+notification";
  const isNotification = action?.behavior === "notification";

  function togglePerson(id: string) {
    setSelectedPeople((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function reset() {
    setSelectedActionId(null);
    setSelectedPeople(new Set());
    setSent(false);
    setSending(false);
  }

  function goBack() {
    setSelectedActionId(null);
    setSelectedPeople(new Set());
    setSent(false);
  }

  function sendAlert() {
    if (!action || selectedPeople.size === 0) return;
    setSending(true);
    // Demo: gönderimi simüle et, gerçekte bildirim/Konum gönderilir.
    setTimeout(() => {
      setSending(false);
      setSent(true);
      toast.success("Acil durum bildirimi gönderildi");
    }, 900);
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          Acil Durum Eylemleri
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Bir durum seç, kimlere gideceğini işaretle ve gönder. Duruma göre anlık bildirim ve/veya
          konum paylaşımı tetiklenir.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* DURUM SEÇİMİ */}
        {!action && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {EMERGENCY_ACTIONS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => setSelectedActionId(a.id)}
                className="flex items-center gap-2.5 rounded-xl border border-border p-3 text-left transition-colors hover:border-red-300 hover:bg-red-50/40"
              >
                <span className="text-2xl">{a.emoji}</span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{a.label}</span>
                  <span className="block text-xs text-muted-foreground">{a.description}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {/* DURUM SEÇİLDİ — kişi seçimi */}
        {action && !sent && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 rounded-xl bg-muted px-3 py-2">
              <span className="flex min-w-0 items-center gap-2 text-sm font-semibold">
                <span className="text-xl">{action.emoji}</span>
                <span className="truncate">{action.label}</span>
              </span>
              <div className="flex shrink-0 items-center gap-1.5">
                {includeLocation && (
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="h-3 w-3" /> Konum
                  </Badge>
                )}
                {isNotification && (
                  <Badge variant="outline" className="gap-1">
                    <Bell className="h-3 w-3" /> Bildirim
                  </Badge>
                )}
                <Button variant="ghost" size="sm" onClick={goBack}>
                  Değiştir
                </Button>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Kime gönderilecek? ({selectedPeople.size} seçili)
              </p>
              <div className="grid grid-cols-1 gap-2">
                {MOCK_PEOPLE.map((p) => (
                  <label
                    key={p.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-2.5 transition-colors hover:bg-muted/30"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPeople.has(p.id)}
                      onChange={() => togglePerson(p.id)}
                      className="h-4 w-4 rounded border-border accent-red-500"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{p.name}</span>
                      <span className="block text-xs text-muted-foreground">{p.relation}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {includeLocation && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                Bu durumda anlık konumun da paylaşılır.
              </p>
            )}
            {isNotification && action.behavior !== "location+notification" && (
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <BellRing className="h-3.5 w-3.5" />
                Bu durum anlık (hızlı) bildirim olarak gider; konum paylaşımı isteyip istemediğin sana
                ayrıca sorulur.
              </p>
            )}

            <div className="flex flex-col gap-2">
              <Button
                className="w-full gap-2"
                onClick={sendAlert}
                disabled={selectedPeople.size === 0 || sending}
              >
                <Send className="h-4 w-4" />
                {sending ? "Gönderiliyor…" : "Acil Durumu Gönder"}
              </Button>
              <Button variant="ghost" size="sm" className="w-full" onClick={reset}>
                Vazgeç
              </Button>
            </div>
          </div>
        )}

        {/* GÖNDERİLDİ ONAYI + ALICI SİMÜLASYONU */}
        {action && sent && (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2 rounded-xl bg-emerald-50 px-4 py-5 text-center text-emerald-700">
              <CheckCircle2 className="h-8 w-8" />
              <p className="text-base font-bold">
                {action.label} durumun {selectedPeople.size} kişiye iletildi.
              </p>
              <p className="text-sm">
                {includeLocation && "Anlık konumun paylaşıldı. "}
                Anlık bildirim gönderildi. Sevdiklerin sana ulaşabilir.
              </p>
            </div>

            <ReceiverPreview
              action={action}
              people={MOCK_PEOPLE.filter((p) => selectedPeople.has(p.id))}
              includeLocation={includeLocation}
            />

            <p className="text-center text-xs text-muted-foreground">
              Gerçek acil durumlarda her zaman 112'yi de ara.
            </p>
            <Button variant="secondary" className="w-full" onClick={reset}>
              Yeni Acil Durum
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface ReceiverPreviewProps {
  action: EmergencyAction;
  people: (typeof MOCK_PEOPLE)[number][];
  includeLocation: boolean;
}

function ReceiverPreview({ action, people, includeLocation }: ReceiverPreviewProps) {
  const showLocation =
    includeLocation && (action.behavior === "location" || action.behavior === "location+notification");

  return (
    <div className="space-y-3">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <Smartphone className="h-3.5 w-3.5" />
        Alıcının ekranında nasıl görünür? (simülasyon)
      </p>

      {people.length === 0 ? (
        <div className="rounded-xl border border-dashed px-3 py-4 text-center text-xs text-muted-foreground">
          Seçili alıcı yok — önizleme gösterilemiyor.
        </div>
      ) : (
        people.map((person) => (
          <div key={person.id} className="overflow-hidden rounded-2xl border bg-background shadow-sm">
            <div className="flex items-center justify-between border-b bg-muted/40 px-3 py-1.5 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <Smartphone className="h-3 w-3" />
                {person.name} · {person.relation}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                şimdi
              </span>
            </div>

            <div className="space-y-3 p-3">
              <div className="flex items-start gap-2.5 rounded-xl bg-destructive/10 p-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive text-white">
                  <BellRing className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold leading-tight">
                    {action.label} bildirimi
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {action.description} — {person.name} sana bir acil durum bildirimi gönderdi.
                  </p>
                </div>
              </div>

              {showLocation && (
                <div className="space-y-1.5 rounded-xl border p-3">
                  <p className="flex items-center gap-1.5 text-xs font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-destructive" />
                    Anlık konum paylaşıldı
                  </p>
                  <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                    <Navigation className="h-4 w-4 text-muted-foreground" />
                    <div className="text-xs">
                      <p className="font-medium">Atatürk Bulvarı No: 24, Kadıköy</p>
                      <p className="text-muted-foreground">Canlı · ~3 dk güncellenir</p>
                    </div>
                  </div>
                  <Button size="sm" variant="secondary" className="w-full gap-1.5">
                    <Navigation className="h-3.5 w-3.5" />
                    Konuma Git / Yol Tarifi Al
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))
      )}

      <p className="rounded-lg bg-muted/50 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
        <Bell className="h-3 w-3" /> Bu, tek kişi test ettiğin için karşı tarafın gördüğünü canlı
        önizleme olarak gösterir. Gerçek uygulamada bildirim, seçilen kişinin telefonuna düşer.
      </p>
    </div>
  );
}
