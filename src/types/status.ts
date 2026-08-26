/**
 * Uygulama genelinde paylaşılan tip tanımları.
 * Backend'e geçişte bu tipler Supabase şemasıyla birebir eşleşecek şekilde
 * tasarlandı (snake_case alan adları API katmanında map'lenir).
 */

/** Durumun ait olduğu üst kategori. Renk/ton seçimini de bu belirler. */
export type StatusCategory = "emotion" | "physical" | "need" | "situation" | "urgent";

/** Kartın görsel tonunu belirleyen semantik ruh hali grubu. */
export type MoodTone = "calm" | "joy" | "low" | "need" | "urgent";

/** Durumun kimlerle paylaşılacağı — gizlilik çemberleri. */
export type PrivacyCircle = "everyone" | "close" | "inner";

/** Tek dokunuşla gönderilen empati tepkileri. */
export type ReactionKind = "hug" | "heart" | "coffee";

/** Katalogdaki önceden tanımlı mikro-durum. */
export interface StatusOption {
  id: string;
  /** Türkçe görünen ad, örn. "Huzurlu". */
  label: string;
  emoji: string;
  category: StatusCategory;
  tone: MoodTone;
  /** Arama kutusunda eşleşmeyi artıran ek anahtar kelimeler. */
  keywords?: string[] | undefined;
}

export interface Person {
  id: string;
  name: string;
  /** Kullanıcının çemberdeki rolü, örn. "Anne". */
  relation: string;
  avatarUrl?: string | undefined;
  /** Bu kişinin hangi gizlilik çemberinde olduğu. */
  circle: Exclude<PrivacyCircle, "everyone">;
}

/** Bir kişinin yayınladığı durum kaydı. */
export interface StatusEntry {
  id: string;
  person: Person;
  status: StatusOption;
  /** ISO 8601 zaman damgası. */
  createdAt: string;
  privacy: PrivacyCircle;
  /** Kullanıcının eklediği kısa serbest not (opsiyonel). */
  note?: string | undefined;
  /** Tepki türü başına sayaç. */
  reactions: Record<ReactionKind, number>;
  /** Mevcut kullanıcının gönderdiği tepkiler (optimistic UI için). */
  myReactions: ReactionKind[];
}

/** Yeni durum yayınlama isteği (backend'e gidecek payload). */
export interface PublishStatusInput {
  statusId: string;
  privacy: PrivacyCircle;
  note?: string | undefined;
}

/** Feed filtreleme seçenekleri. */
export interface FeedFilters {
  circle: PrivacyCircle;
  /** Sadece 24 saatten yeni (aktif) durumları göster. */
  onlyActive: boolean;
}
