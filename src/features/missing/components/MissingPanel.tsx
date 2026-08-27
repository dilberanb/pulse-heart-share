import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Download,
  Share2,
  MessageCircle,
  X as XIcon,
  Send,
  CheckCircle2,
  ShieldAlert,
  Camera,
  Pencil,
  X,
  ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MissingCard } from "@/features/missing/components/MissingCard";
import { MISSING_PEOPLE, MISSING_PETS } from "@/features/missing/data/mockMissing";
import {
  downloadCardAsPng,
  nativeShare,
  whatsappShare,
  twitterShare,
  telegramShare,
} from "@/features/missing/lib/shareCard";
import type { MissingProfile } from "@/features/missing/types";
import { usePublishStatus } from "@/features/status/hooks/useStatusFeed";
import { cn } from "@/lib/utils";

function initials(n: string) {
  return n
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Görsel yüklenemezse emoji/initials'a düşen img. */
function ImgOrFallback({
  profile,
  className,
}: {
  profile: MissingProfile;
  className: string;
}) {
  const [failed, setFailed] = useState(false);
  if (profile.photo && !failed) {
    return (
      <span className="inline-block h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
        <img
          src={profile.photo}
          alt={profile.name}
          onError={() => setFailed(true)}
          className="h-full w-full rounded-full object-cover"
        />
      </span>
    );
  }
  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-muted text-xl">
      {profile.emoji ?? (
        <span className="text-xs font-bold">{initials(profile.name)}</span>
      )}
    </span>
  );
}

const DEFAULT_PERSON: MissingProfile = {
  id: "yeni-kisi",
  kind: "person",
  name: "",
  ageLabel: "",
  subtitle: "Aile Üyesi",
  detail: "",
  homeAddress: "",
  contact: "",
  lastSeenPlace: "",
  lastSeenTime: "",
  description: "",
};

const DEFAULT_PET: MissingProfile = {
  id: "yeni-hayvan",
  kind: "pet",
  name: "",
  ageLabel: "",
  subtitle: "Evcil Hayvan",
  detail: "",
  homeAddress: "",
  contact: "",
  lastSeenPlace: "",
  lastSeenTime: "",
  description: "",
};

export function MissingPanel({ className }: { className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [missing, setMissing] = useState<MissingProfile | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState<"download" | "share" | null>(null);
  const publish = usePublishStatus();

  function markMissing(p: MissingProfile) {
    // Seçimde profile referansını kopyala; yüklenecek fotoğraf/veri bu kopya üzerinde yaşasın.
    setMissing({ ...p });
    setEditing(false);
    setConfirmed(false);
  }

  function startNew(kind: "person" | "pet") {
    setMissing(kind === "pet" ? { ...DEFAULT_PET } : { ...DEFAULT_PERSON });
    setEditing(true);
    setConfirmed(false);
  }

  function update<K extends keyof MissingProfile>(key: K, value: MissingProfile[K]) {
    setMissing((m) => (m ? { ...m, [key]: value } : m));
  }

  function handlePhoto(file: File | undefined) {
    if (!file || !missing) return;
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => setMissing((m) => (m ? { ...m, photo: String(reader.result) } : m));
    reader.readAsDataURL(file);
  }

  function confirmMissing() {
    if (!missing) return;
    setConfirmed(true);
    setEditing(false);
    publish.mutate({
      statusId: missing.kind === "pet" ? "petlost" : "personmissing",
      privacy: "everyone",
      note: `KAYIP: ${missing.name} (${missing.subtitle}). Son görülme: ${missing.lastSeenPlace}. Arayan: ${missing.contact}`,
    });
  }

  async function handleDownload() {
    if (!cardRef.current) return;
    setBusy("download");
    try {
      await downloadCardAsPng(cardRef.current, `kayip-${missing?.id ?? "ilan"}`);
    } finally {
      setBusy(null);
    }
  }

  async function handleShare() {
    if (!cardRef.current || !missing) return;
    setBusy("share");
    try {
      const dataUrl = await downloadCardAsPng(cardRef.current, `kayip-${missing.id}`);
      const ok = await nativeShare(
        dataUrl,
        `${missing.name} Kayıp`,
        `KAYIP: ${missing.name}, son görülme ${missing.lastSeenPlace}`,
      );
      if (!ok) await handleDownload();
    } finally {
      setBusy(null);
    }
  }

  function reset() {
    setMissing(null);
    setEditing(false);
    setConfirmed(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  const shareText = (m: MissingProfile) =>
    `🚨 KAYIP! ${m.name} (${m.subtitle}, ${m.ageLabel}) bulunamıyor. Son görüldüğü yer: ${m.lastSeenPlace}. Bilgisi olan ${m.contact} numarasından ulaşsın. ${location.origin}`;

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <ShieldAlert className="h-4 w-4 text-red-500" />
          Kayıp İlanı / Kimlik Kartı
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Hazır bir aile üyesi/hayvan seç ya da kendi kişinin için düzenleyip fotoğraf ekle;
          saniyeler içinde paylaşıma hazır kimlik kartı oluştur.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* SEÇİM / YENİ EKLEME */}
        {!missing && (
          <>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => startNew("person")}>
                <Pencil className="h-4 w-4" /> Yeni Kişi
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" onClick={() => startNew("pet")}>
                <Pencil className="h-4 w-4" /> Yeni Evcil Hayvan
              </Button>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Aile üyeleri
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {MISSING_PEOPLE.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => markMissing(p)}
                    className="flex items-center gap-2.5 rounded-xl border border-border p-2.5 text-left transition-colors hover:border-red-300 hover:bg-red-50/40"
                  >
                    <ImgOrFallback profile={p} className="h-10 w-10" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{p.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {p.subtitle} · {p.ageLabel}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Evcil hayvanlar
              </p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {MISSING_PETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => markMissing(p)}
                    className="flex items-center gap-2.5 rounded-xl border border-border p-2.5 text-left transition-colors hover:border-red-300 hover:bg-red-50/40"
                  >
                    <ImgOrFallback profile={p} className="h-10 w-10" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{p.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {p.subtitle} · {p.ageLabel}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* DÜZENLEME FORMU */}
        {missing && editing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold">Kartı düzenle</p>
              <Button variant="ghost" size="sm" onClick={reset} className="gap-1">
                <X className="h-4 w-4" /> İptal
              </Button>
            </div>

            {/* Fotoğraf yükleme */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="relative grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl border border-dashed border-border bg-muted text-3xl"
              >
                {missing.photo ? (
                  <img
                    src={missing.photo}
                    alt={missing.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  missing.emoji ?? <ImageIcon className="h-8 w-8 text-muted-foreground" />
                )}
                <span className="absolute bottom-0 right-0 grid h-6 w-6 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Camera className="h-3.5 w-3.5" />
                </span>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhoto(e.target.files?.[0])}
              />
              <div className="text-sm">
                <p className="font-semibold">Fotoğraf</p>
                <p className="text-xs text-muted-foreground">
                  Cihazından bir görsel seç (PNG/JPG). Seçmezsen baş harfler/emoji gösterilir.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="m-name">İsim</Label>
                <Input id="m-name" value={missing.name} onChange={(e) => update("name", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="m-age">Yaş / Etiket</Label>
                <Input id="m-age" value={missing.ageLabel} onChange={(e) => update("ageLabel", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="m-sub">Yakınlık / Tür</Label>
                <Input id="m-sub" value={missing.subtitle} onChange={(e) => update("subtitle", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="m-detail">Cins / Detay</Label>
                <Input id="m-detail" value={missing.detail ?? ""} onChange={(e) => update("detail", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="m-place">Son görüldüğü yer</Label>
                <Input id="m-place" value={missing.lastSeenPlace} onChange={(e) => update("lastSeenPlace", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="m-time">Son görüldüğü saat</Label>
                <Input id="m-time" value={missing.lastSeenTime} onChange={(e) => update("lastSeenTime", e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="m-address">Eve ait adres</Label>
                <Input id="m-address" value={missing.homeAddress} onChange={(e) => update("homeAddress", e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="m-contact">İletişim / Telefon</Label>
                <Input id="m-contact" value={missing.contact} onChange={(e) => update("contact", e.target.value)} />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="m-desc">Açıklama</Label>
                <Textarea
                  id="m-desc"
                  rows={3}
                  value={missing.description}
                  onChange={(e) => update("description", e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                className="w-full gap-2"
                onClick={confirmMissing}
                disabled={!missing.name.trim() || publish.isPending}
              >
                <CheckCircle2 className="h-4 w-4" />
                {missing.name.trim() ? "Kayıp Olarak İlan Et" : "Önce isim girin"}
              </Button>
              <Button variant="ghost" size="sm" className="w-full" onClick={reset}>
                Vazgeç
              </Button>
            </div>
          </div>
        )}

        {/* ONYARGI / ÖNİZLEME (seçildi, henüz ilan edilmedi) */}
        {missing && !editing && !confirmed && (
          <div className="space-y-4">
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setEditing(true)} className="gap-1.5">
                    <Pencil className="h-4 w-4" /> Düzenle
                  </Button>
                </div>
                <MissingCard ref={cardRef} profile={missing} />
              </motion.div>
            </AnimatePresence>
            <div className="flex flex-col gap-2">
              <Button className="w-full gap-2" onClick={confirmMissing} disabled={publish.isPending}>
                <CheckCircle2 className="h-4 w-4" />
                Kayıp Olarak İlan Et
              </Button>
              <Button variant="ghost" size="sm" className="w-full" onClick={reset}>
                Vazgeç
              </Button>
            </div>
          </div>
        )}

        {/* İLAN EDİLDİ */}
        {missing && confirmed && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              <ShieldAlert className="h-4 w-4" />
              {missing.name} kayıp olarak ilan edildi.
            </div>

            <MissingCard ref={cardRef} profile={missing} />

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-center gap-2" onClick={handleDownload} disabled={busy === "download"}>
                <Download className="h-4 w-4" />
                {busy === "download" ? "Oluşturuluyor…" : "Görseli İndir"}
              </Button>
              <Button variant="outline" className="justify-center gap-2" onClick={handleShare} disabled={busy === "share"}>
                <Share2 className="h-4 w-4" />
                Paylaş
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={whatsappShare(location.origin, shareText(missing))}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </a>
              <a
                href={twitterShare(location.origin, shareText(missing))}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                <XIcon className="h-4 w-4" /> X / Twitter
              </a>
              <a
                href={telegramShare(location.origin, shareText(missing))}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#229ED9] px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                <Send className="h-4 w-4" /> Telegram
              </a>
              <Button variant="secondary" className="justify-center" onClick={reset}>
                Bulundu / İptal
              </Button>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Ekran görüntüsünü de alabilir ya da görseli indirip sosyal medyada paylaşabilirsin.
            </p>
          </div>
        )}

        {publish.isPending && <Badge variant="secondary">Bildirim yayınlanıyor…</Badge>}
      </CardContent>
    </Card>
  );
}
