import { useState } from "react";
import { HeartPulse, Droplets, Pill, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const STORAGE_KEY = "nabiz:tibbi:kart";

const BLOOD_GROUPS = ["0 Rh+", "0 Rh-", "A Rh+", "A Rh-", "B Rh+", "B Rh-", "AB Rh+", "AB Rh-", "Bilmiyorum"];

interface MedicalData {
  accepted: boolean;
  bloodGroup: string;
  chronic: string;
  allergies: string;
  medications: string[];
  notes: string;
}

const EMPTY: MedicalData = {
  accepted: false,
  bloodGroup: "Bilmiyorum",
  chronic: "",
  allergies: "",
  medications: [],
  notes: "",
};

function load(): MedicalData {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

export function MedicalCard({ className }: { className?: string }) {
  const [data, setData] = useState<MedicalData>(load);
  const [medInput, setMedInput] = useState("");
  const [saved, setSaved] = useState(!!load().accepted || false);

  const isEditing = !data.accepted;

  function update(patch: Partial<MedicalData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function addMed() {
    const v = medInput.trim();
    if (!v) return;
    update({ medications: [...data.medications, v] });
    setMedInput("");
  }

  function removeMed(i: number) {
    update({ medications: data.medications.filter((_, idx) => idx !== i) });
  }

  function save() {
    const next = { ...data, accepted: true };
    setData(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* yoksay */
    }
    setSaved(true);
    toast.success("Tıbbi kart kaydedildi");
  }

  function edit() {
    setSaved(false);
    setData((prev) => ({ ...prev, accepted: false }));
  }

  if (saved) {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <HeartPulse className="h-4 w-4 text-red-500" />
            Tıbbi Kartım
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Acil durumda görevlilerin hızlıca bilmesi için kaydedildi.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Row label="Kan Grubu" value={data.bloodGroup} icon={<Droplets className="h-4 w-4 text-red-500" />} />
          {data.chronic && <Row label="Kronik Hastalık" value={data.chronic} icon={<HeartPulse className="h-4 w-4 text-red-500" />} />}
          {data.allergies && <Row label="Alerjiler" value={data.allergies} icon={<Plus className="h-4 w-4 text-amber-500" />} />}
          {(data.medications.length > 0 || data.notes) && (
            <div className="rounded-xl border border-border p-3">
              <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Pill className="h-3.5 w-3.5" /> İlaçlar & Notlar
              </p>
              {data.medications.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {data.medications.map((m, i) => (
                    <Badge key={i} variant="secondary">{m}</Badge>
                  ))}
                </div>
              )}
              {data.notes && <p className="text-sm text-foreground">{data.notes}</p>}
            </div>
          )}
          <Button variant="outline" className="w-full" onClick={edit}>Düzenle</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <HeartPulse className="h-4 w-4 text-red-500" />
          Tıbbi Kart
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Kan grubu, kronik hastalık, alerji ve düzenli kullandığın ilaçları kaydet. Bu bilgiler
          acil durumda hayat kurtarabilir.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label>Kan Grubu</Label>
          <div className="flex flex-wrap gap-1.5">
            {BLOOD_GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => update({ bloodGroup: g })}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                  data.bloodGroup === g
                    ? "border-red-500/50 bg-red-500/10 text-red-500"
                    : "border-border bg-muted/30 text-muted-foreground hover:bg-muted/60"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Kronik Hastalıklar</Label>
          <Input
            value={data.chronic}
            onChange={(e) => update({ chronic: e.target.value })}
            placeholder="Örn. diyabet, tansiyon, astım…"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Alerjiler</Label>
          <Input
            value={data.allergies}
            onChange={(e) => update({ allergies: e.target.value })}
            placeholder="Örn. penisilin, fıstık, lateks…"
          />
        </div>

        <div className="space-y-1.5">
          <Label>Düzenli İlaçlar</Label>
          <div className="flex gap-2">
            <Input
              value={medInput}
              onChange={(e) => setMedInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addMed(); } }}
              placeholder="İlaç adı"
            />
            <Button type="button" variant="outline" onClick={addMed} className="shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {data.medications.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {data.medications.map((m, i) => (
                <Badge key={i} variant="secondary" className="gap-1.5 pr-1">
                  {m}
                  <button
                    type="button"
                    onClick={() => removeMed(i)}
                    className="rounded-full p-0.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                    aria-label={`${m} sil`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label>Ek Notlar</Label>
          <Textarea
            rows={2}
            value={data.notes}
            onChange={(e) => update({ notes: e.target.value })}
            placeholder="Örn. implante kalp pili var, kan sulandırıcı kullanıyor…"
          />
        </div>

        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-3 text-xs leading-relaxed text-amber-700 dark:text-amber-300">
          <p className="font-bold">Önemli sorumluluk reddi (zorunlu)</p>
          <p>
            Bu bilgilerin doğru ve güncel olduğunu, tıbbi verilerin gizliliğinin korunması için
            yalnızca senin cihazında ve paylaşmayı seçtiğin kişilerle paylaşılabileceğini kabul
            ediyorum. Acil durumda bu bilgiler hayati önem taşır; eksik veya yanlış bilgi yanlış
            müdahaleye yol açabilir.
          </p>
          <label className="mt-2 flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={data.accepted}
              onChange={(e) => update({ accepted: e.target.checked })}
              className="h-4 w-4 rounded border-amber-300 accent-amber-500"
            />
            <span className="font-semibold">Yukarıdaki sorumluluk reddini okudum ve kabul ediyorum</span>
          </label>
        </div>

        <Button className="w-full" onClick={save} disabled={!data.accepted}>
          Tıbbi Kartı Kaydet
        </Button>
      </CardContent>
    </Card>
  );
}

function Row({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border p-3">
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}
