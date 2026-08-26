/** Zaman biçimlendirme yardımcıları (Türkçe, kısa ve okunabilir). */

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** "12 dk önce", "3 sa önce", "2 gün önce" gibi göreli zaman üretir. */
export function relativeTimeTr(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();
  if (diff < MINUTE) return "az önce";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)} dk önce`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)} sa önce`;
  return `${Math.floor(diff / DAY)} gün önce`;
}

/** Efemer durumun sona ermesine kalan süre (24 saat kuralı). */
export function expiresInTr(isoDate: string): string | null {
  const remaining = DAY - (Date.now() - new Date(isoDate).getTime());
  if (remaining <= 0) return null;
  if (remaining < HOUR) return `${Math.max(1, Math.floor(remaining / MINUTE))} dk içinde sona erer`;
  return `${Math.floor(remaining / HOUR)} sa içinde sona erer`;
}

/** Baş harfleri avatar için çıkarır: "Ayşe Yılmaz" -> "AY". */
export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toLocaleUpperCase("tr") ?? "")
    .join("");
}
