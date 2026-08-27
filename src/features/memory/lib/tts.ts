/**
 * Tutarlı, doğal bir Türkçe konuşma sentezi yardımcısı.
 * - Türkçe (tr/tr-TR) doğal (neural) sesleri önceliklendirir.
 * - Farklı tarayıcılar/OS'lerde en iyi mevcut Türkçe sesi seçer.
 * - Yavaş ve net konuşur (Alzheimer / güvenlik modu için).
 */

let cachedVoices: SpeechSynthesisVoice[] | null = null;

/**
 * Türkçe sesler için öncelik sıralaması (en doğal/neural'den en robotiğe).
 * - "Microsoft"/"OneCore" sesleri (Tolga Natural, Aylin Natural...) gerçek neural'dir
 *   ve yalnızca Edge'de listelenir.
 * - Google'ın eski yerleşik Türkçe sesi robotik "teneke" tında olduğu için en sonda tutulur.
 */
const TURKISH_VOICE_PRIORITY = [
  // Microsoft/Edge doğal neural sesler
  "microsoft",
  "edge",
  "onecore",
  "tolga natural",
  "aylin natural",
  "dila natural",
  // macOS/iOS doğal (Siri ailesi) sesler
  "neural",
  "natural",
  "enhanced",
  "premium",
  "online",
  "multilingual",
  "onnx",
  "siri",
  "arlet",
  "zikra",
  // Tolga/Aylin genel (V110 yerli model)
  "tolga",
  "aylin",
  "dila",
  "ecem",
  "emel",
  "harry",
  "tr-tr",
  "turkish",
  "tr",
];

/**
 * Doğal/neural Türkçe sesi seçer. Chrome'da birden çok ses listeleniyorsa
 * Microsoft/Edge doğal seslerini öne alır; yalnızca eski "Google Türkçe"
 * varsa onu kullanır (Chrome'un limiti budur).
 */

function loadVoices(): SpeechSynthesisVoice[] {
  if (!("speechSynthesis" in window)) return [];
  if (cachedVoices && cachedVoices.length) return cachedVoices;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length) cachedVoices = voices;
  return voices;
}

/** En iyi Türkçe sesi bulur. Bulunamazsa null döner. */
export function pickTurkishVoice(): SpeechSynthesisVoice | null {
  const voices = loadVoices();
  const turkish = voices.filter((v) =>
    (v.lang || "").toLowerCase().startsWith("tr"),
  );
  if (!turkish.length) return null;

  // Öncelik sırasına göre sırala
  const score = (v: SpeechSynthesisVoice): number => {
    const name = (v.name ?? "").toLowerCase();
    for (let i = 0; i < TURKISH_VOICE_PRIORITY.length; i++) {
      const key = TURKISH_VOICE_PRIORITY[i];
      if (key && name.includes(key) && i > 0) return i;
    }
    return 999;
  };
  const ranked = [...turkish].sort((a, b) => score(a) - score(b));

  return ranked[0] ?? null;
}

/** Tarayıcı sesleri yüklenince çalışacak bir dinleyici kurar (React mount'ta çağır). */
export function primeTurkishVoices() {
  if (!("speechSynthesis" in window)) return;
  const refresh = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
  // Bazı tarayıcılar getVoices()'i asenkron doldurur / onvoiceschanged tetiklemez
  window.speechSynthesis.onvoiceschanged = refresh;
  refresh();

  // Chrome bug'ı: onvoiceschanged bazen hiç çalışmaz -> kısa süreli poll fallback
  const tries = 8;
  let count = 0;
  const timer = window.setInterval(() => {
    count += 1;
    refresh();
    if (cachedVoices?.length || count >= tries) {
      window.clearInterval(timer);
    }
  }, 150);
}

export interface SpeakOptions {
  /** 0.1–2; 1 = normal. Alzheimer için ~0.9 (yavaş). */
  rate?: number;
  /** 0–2; 1 = normal */
  pitch?: number;
  volume?: number;
  /** Konuşurken önceki konuşmayı iptal et */
  cancelPrevious?: boolean;
}

/** Metni en doğal bulunan Türkçe sesle okur. */
export function speakTurkish(text: string, options: SpeakOptions = {}) {
  if (!("speechSynthesis" in window)) return;
  const {
    rate = 0.9,
    pitch = 1,
    volume = 1,
    cancelPrevious = true,
  } = options;

  if (cancelPrevious) window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const voice = pickTurkishVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = voice?.lang || "tr-TR";
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = volume;

  window.speechSynthesis.speak(utterance);
}

/** Konuşmayı durdurur. */
export function stopSpeaking() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
}

/**
 * İki koordinat arası mesafe (haversine, metre).
 */
export function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Başlangıç ve hedef arası başlık (derece). 0 = kuzey.
 */
export function bearingDegrees(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) -
    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}
