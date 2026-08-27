/**
 * Kayıp kimlik kartı için ortak veri modeli.
 * Hem aile üyeleri (person) hem evcil hayvanlar (pet) için kullanılır.
 */

export type MissingKind = "person" | "pet";

export interface MissingProfile {
  id: string;
  kind: MissingKind;
  name: string;
  /** Kişi için yaş (örn. "68"), hayvan için yaş etiketi (örn. "3 yaş") */
  ageLabel: string;
  /** Kişi için yakınlık, hayvan için tür */
  subtitle: string;
  /** cins / ırk (hayvan için) */
  detail?: string;
  /** Fotoğraf/avatar url veya emoji (hayvan için) */
  photo?: string;
  emoji?: string;
  homeAddress: string;
  /** Telefon / sahibi iletişim */
  contact: string;
  /** Son sinyal alınan yer ve saat */
  lastSeenPlace: string;
  lastSeenTime: string;
  description: string;
}
