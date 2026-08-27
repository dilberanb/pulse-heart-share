import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Download, Share2, MessageCircle, X as XIcon, Send, CheckCircle2, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

export function MissingPanel({ className }: { className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [missing, setMissing] = useState<MissingProfile | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState<"download" | "share" | null>(null);
  const publish = usePublishStatus();

  function markMissing(p: MissingProfile) {
    setMissing(p);
    setConfirmed(false);
  }

  function confirmMissing() {
    if (!missing) return;
    setConfirmed(true);
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
      const ok = await nativeShare(dataUrl, `${missing.name} Kayıp`, `KAYIP: ${missing.name}, son görülme ${missing.lastSeenPlace}`);
      if (!ok) await handleDownload();
    } finally {
      setBusy(null);
    }
  }

  function reset() {
    setMissing(null);
    setConfirmed(false);
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
          Aile üyenden ya da evcil hayvanından biri kaybolduğunda, saniyeler içinde paylaşıma hazır
          kimlik kartı oluştur; hemen sosyal medyada paylaş ya da yetkililere ver.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {!missing && (
          <>
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
                    <span className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </span>
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
                    <span className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                      <img
                        src={p.photo}
                        alt={p.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    </span>
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

        {missing && !confirmed && (
          <div className="space-y-4">
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <MissingCard ref={cardRef} profile={missing} />
              </motion.div>
            </AnimatePresence>
            <div className="flex flex-col gap-2">
              <Button
                className="w-full gap-2"
                onClick={confirmMissing}
              >
                <CheckCircle2 className="h-4 w-4" />
                Kayıp Olarak İlan Et
              </Button>
              <Button variant="ghost" size="sm" className="w-full" onClick={reset}>
                Vazgeç
              </Button>
            </div>
          </div>
        )}

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

        {publish.isPending && (
          <Badge variant="secondary">Bildirim yayınlanıyor…</Badge>
        )}
      </CardContent>
    </Card>
  );
}
