import { useState } from "react";
import {
  ChevronDown,
  MapPin,
  Phone,
  Users,
  Backpack,
  CheckCircle2,
  RefreshCw,
  Pencil,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_PEOPLE } from "@/features/status/api/mockApi";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "nabiz:deprem:tahliye";

interface Plan {
  meetingPoint: string;
  route: string;
  contact: string;
  bag: string;
}

const SAMPLE_PLAN: Plan = {
  meetingPoint: "Mahalle ilkokulu bahçesi (Atatürk İlkokulu), ana kapı önü",
  route: "Ev → merdivenleri değil, ana çıkış kapısını kullan → güvenli alana kadar duvarları takip et",
  contact: "Anne (0532 123 45 67) — ulaşılamazsa Babaanne (0532 111 22 33)",
  bag: "Su, düdük, ilaçlar, kimlikler, powerbank, battaniye, değerli evrak",
};

function loadPlan(): Plan {
  if (typeof window === "undefined") return SAMPLE_PLAN;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...SAMPLE_PLAN, ...JSON.parse(raw) } : SAMPLE_PLAN;
  } catch {
    return SAMPLE_PLAN;
  }
}

const DEFAULT_SYNC = ["p1", "p2"];

export function EvacuationPlan({ className }: { className?: string }) {
  const [plan, setPlan] = useState<Plan>(loadPlan);
  const [editing, setEditing] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("route");
  const [synced, setSynced] = useState<Set<string>>(new Set(DEFAULT_SYNC));
  const [syncing, setSyncing] = useState(false);
  const [draft, setDraft] = useState<Plan>(plan);

  function save() {
    setPlan(draft);
    setEditing(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      /* yoksay */
    }
    toast.success("Tahliye planın güncellendi");
  }

  function toggleSync(id: string) {
    setSynced((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function sendToFamily() {
    setSyncing(true);
    setTimeout(() => {
      setSyncing(false);
      toast.success(`Tahliye planı ${synced.size} kişiyle senkronize edildi`);
    }, 900);
  }

  const sections = [
    { id: "route", icon: MapPin, title: "Tahliye Rotası", value: plan.route },
    { id: "meeting", icon: Users, title: "Toplanma Alanı", value: plan.meetingPoint },
    { id: "contact", icon: Phone, title: "Acil İletişim", value: plan.contact },
    { id: "bag", icon: Backpack, title: "Acil Çanta", value: plan.bag },
  ];

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <MapPin className="h-4 w-4 text-amber-500" />
          Aile Tahliye Planı
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Örnek planı tıklayarak kendine uyarla, ailenle senkronize et. Her bölümün ayrıntısı
          tıklanınca açılır.
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {!editing ? (
          <>
            {sections.map((s) => {
              const Icon = s.icon;
              const open = openSection === s.id;
              return (
                <div key={s.id} className="overflow-hidden rounded-xl border border-border">
                  <button
                    type="button"
                    onClick={() => setOpenSection(open ? null : s.id)}
                    className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-muted/30"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-amber-500" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">{s.title}</span>
                      <span className="block truncate text-xs text-muted-foreground">{s.value}</span>
                    </span>
                    <ChevronDown
                      className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
                    />
                  </button>
                  {open && (
                    <div className="border-t border-border bg-muted/20 p-3 text-sm leading-relaxed text-foreground">
                      {s.value}
                    </div>
                  )}
                </div>
              );
            })}

            <Button variant="outline" className="w-full gap-2" onClick={() => { setDraft(plan); setEditing(true); }}>
              <Pencil className="h-4 w-4" /> Planı Kendime Uyarla
            </Button>

            {/* Aile senkronizasyonu */}
            <div className="rounded-xl border border-border bg-muted/20 p-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <RefreshCw className="h-3.5 w-3.5" /> Aile ile senkronize et
              </p>
              <div className="space-y-1.5">
                {MOCK_PEOPLE.slice(0, 6).map((p) => (
                  <label key={p.id} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-1 py-1 text-sm">
                    <input
                      type="checkbox"
                      checked={synced.has(p.id)}
                      onChange={() => toggleSync(p.id)}
                      className="h-4 w-4 rounded border-border accent-amber-500"
                    />
                    <span className="font-medium">{p.name}</span>
                    <span className="text-xs text-muted-foreground">{p.relation}</span>
                  </label>
                ))}
              </div>
              <Button className="mt-2 w-full gap-2" onClick={sendToFamily} disabled={syncing || synced.size === 0}>
                <CheckCircle2 className="h-4 w-4" />
                {syncing ? "Senkronize ediliyor…" : "Aileye Gönder ve Senkronize Et"}
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Tahliye Rotası</Label>
              <Textarea rows={2} value={draft.route} onChange={(e) => setDraft({ ...draft, route: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Toplanma Alanı</Label>
              <Input value={draft.meetingPoint} onChange={(e) => setDraft({ ...draft, meetingPoint: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Acil İletişim</Label>
              <Textarea rows={2} value={draft.contact} onChange={(e) => setDraft({ ...draft, contact: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Acil Çanta İçeriği</Label>
              <Textarea rows={3} value={draft.bag} onChange={(e) => setDraft({ ...draft, bag: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Button className="w-full" onClick={save}>Kaydet</Button>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => setEditing(false)}>Vazgeç</Button>
            </div>
            <Badge variant="secondary" className="w-full justify-center">Örnek planı dilediğin gibi değiştirebilirsin</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
