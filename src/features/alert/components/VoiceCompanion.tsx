import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Navigation, MapPin, Home, ShieldAlert, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Tarayıcı Ses Tanıma (Web Speech API) tip güvenliği                 */
/* ------------------------------------------------------------------ */

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  readonly [index: number]: { transcript: string } | undefined;
}

interface SpeechRecognitionEventLike {
  results: ReadonlyArray<SpeechRecognitionResultLike>;
}interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: unknown) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognition(): SpeechRecognitionCtor | null {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

/** Dinlenecek hedef komutlar (küçük harf, Türkçe). */
const TARGET_PHRASES = [
  "kayboldum",
  "yolumu kaybettim",
  "beni eve götür",
  "eve götür",
];

/** Tanınan metnin hedef komutlardan biriyle eşleşip eşleşmediğine bakar. */
function matchesCommand(transcript: string): boolean {
  const t = transcript.toLocaleLowerCase("tr-TR");
  return TARGET_PHRASES.some((p) => t.includes(p));
}

/** Varsa ev koordinatı (demo sabiti) — gerçekte kullanıcı profilinden gelir. */
const HOME_GEOCODE = { lat: 41.015137, lng: 28.97953 }; // Kadıköy örn.

/* ------------------------------------------------------------------ */
/*  Beni Eve Götür — mini yol arkadaşı akışı                           */
/* ------------------------------------------------------------------ */

export function VoiceCompanion() {
  const [listening, setListening] = useState(false);
  const [supported] = useState(() => getRecognition() !== null);
  const [heard, setHeard] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    return () => {
      recRef.current?.abort();
    };
  }, []);

  function stopListening() {
    recRef.current?.abort();
    recRef.current = null;
    setListening(false);
  }

  function startListening() {
    const Ctor = getRecognition();
    if (!Ctor) return;
    stopListening();

    const rec = new Ctor();
    rec.lang = "tr-TR";
    rec.continuous = true;
    rec.interimResults = true;
    recRef.current = rec;

    rec.onresult = (event) => {
      let full = "";
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (!result?.isFinal) continue;
        const alt = result[0];
        if (alt?.transcript) full += ` ${alt.transcript}`;
      }
      if (matchesCommand(full)) {
        setHeard("Kayboldum komutunu algıladım.");
        setActive(true);
        stopListening();
        locate();
      }
    };

    rec.onerror = () => {
      stopListening();
      setHeard("Mikrofon algılanamadı ya da izin verilmedi.");
    };

    rec.onend = () => {
      setListening(false);
    };

    try {
      rec.start();
      setListening(true);
      setHeard("Dinliyorum… \"kayboldum\" ya da \"beni eve götür\" de.");
    } catch {
      setListening(false);
      setHeard("Ses tanıma başlatılamadı.");
    }
  }

  function toggleListening() {
    if (listening) {
      stopListening();
      setHeard(null);
    } else {
      startListening();
    }
  }

  function locate() {
    if (!navigator.geolocation) {
      setHeard("Tarayıcı konum desteklemiyor.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setHeard("Konum alınamadı — yine de yön tarifi açılacak."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  function openRoute() {
    const dest = `${HOME_GEOCODE.lat},${HOME_GEOCODE.lng}`;
    const src = location ? `${location.lat},${location.lng}` : "";
    const url = src
      ? `https://www.google.com/maps/dir/${src}/${dest}`
      : `https://www.google.com/maps?q=${dest}`;
    window.open(url, "_blank");
  }

  function resetActive() {
    setActive(false);
    setLocation(null);
    setHeard(null);
  }

  if (!supported) {
    return null;
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <Mic className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-bold text-foreground">Sesli Komut — Beni Eve Götür</h4>
      </div>
      <p className="text-xs text-muted-foreground">
        Mikrofonu aç, <strong>\"kayboldum\"</strong> ya da <strong>\"beni eve götür\"</strong> de —
        evine dönüş yön tarifi ve konum paylaşımı başlasın.
      </p>

      <div className="space-y-3">
        <Button
          variant={listening ? "outline" : "default"}
          onClick={toggleListening}
          className={cn("w-full gap-2", listening && "ring-2 ring-primary/40")}
        >
          {listening ? (
            <>
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
              Dinleniyor — kapatmak için tıkla
            </>
          ) : (
            <>
              <MicOff className="h-4 w-4" />
              Mikrofonu Aç ve Dinle
            </>
          )}
        </Button>

        {heard && (
          <p className="rounded-lg bg-muted/40 px-3 py-2 text-xs text-muted-foreground">{heard}</p>
        )}

        {active && (
          <div className="space-y-2 rounded-xl border-2 border-primary/40 bg-primary/5 p-3">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-sm font-bold text-foreground">
                <Home className="h-4 w-4 text-primary" />
                Beni Eve Götür — Aktif
              </p>
              <button
                type="button"
                onClick={resetActive}
                className="rounded-full p-1 text-muted-foreground hover:bg-muted"
                aria-label="Kapat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Seni evine götürüyorum. Konumun alındı, yön tarifi hazırlanıyor.
            </p>
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs">
              <MapPin className="h-4 w-4 text-primary" />
              {location ? (
                <span>Konum alındı → ev yönü hesaplanıyor</span>
              ) : (
                <span>Konum alınmaya çalışılıyor…</span>
              )}
            </div>
            <Button onClick={openRoute} className="w-full gap-2">
              <Navigation className="h-4 w-4" />
              Yol Tarifi Al
            </Button>
            <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <ShieldAlert className="h-3 w-3" />
              Gerçek acil durumda 112'yi de aramayı unutma.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
