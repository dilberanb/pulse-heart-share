/**
 * Tutarlı, doğal bir Türkçe konuşma sentezi yardımcısı.
 * - Türkçe (tr/tr-TR) doğal (neural) sesleri önceliklendirir.
 * - Farklı tarayıcılar/OS'lerde en iyi mevcut Türkçe sesi seçer.
 * - Yavaş ve net konuşur (Alzheimer / güvenlik modu için).
 */

let cachedVoices: SpeechSynthesisVoice[] | null = null;

/** Türkçe sesler için öncelik sıralaması (en iyiden en kötüye). */
const TURKISH_VOICE_PRIORITY = [
  "tolga",
  "megatron2",
  "aylin",
  "dila",
  "ecem",
  "emel",
  "harry",
  "tr-tr",
  "turkish",
  "tr",
];

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
  const ranked = [...turkish].sort((a, b) => {
    const aname = (a.name || "").toLowerCase();
    const bname = (b.name || "").toLowerCase();
    const ai = TURKISH_VOICE_PRIORITY.findIndex((k) => aname.includes(k));
    const bi = TURKISH_VOICE_PRIORITY.findIndex((k) => bname.includes(k));
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

  // Doğal (neural) sesleri öne al
  const natural = ranked.find(
    (v) =>
      /(natural|online|neural|premium|multilingual|online\(natural\))/i.test(
        v.name,
      ),
  );
  return natural ?? ranked[0] ?? null;
}

/** Tarayıcı sesleri yüklenince çalışacak bir dinleyici kurar (React mount'ta çağır). */
export function primeTurkishVoices() {
  if (!("speechSynthesis" in window)) return;
  // Bazı tarayıcılar getVoices() asenkron doldurur
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
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
