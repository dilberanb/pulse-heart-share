/**
 * Kullanıcı profil tipleri.
 * Uygulama açılışında seçilir ve ana arayüz bu profile göre kişiselleştirilir:
 * öne çıkan araçlar, tema (büyük harf/sade ekran) ve navigasyon öncelikleri.
 */

export type UserProfile =
  | "memory" // Hafıza sorunu (Alzheimer/demans) — hafıza araçları öncelikli
  | "child" // Çocuk — "annemi ara" ve basit ihtiyaçlar öncelikli
  | "safety" // Kadın/güvenlik — güvenlik ve konum paylaşımı ön planda
  | "senior" // Yaşlı — büyük harfler, sade ekran, yaşlı modu varsayılan
  | "disabled" // Engelli — erişilebilirlik öncelikli
  | "general"; // Genel / varsayılan — tüm özellikler dengeli

/** Onboarding'de gösterilecek profil kartları — tek kaynak. */
export interface ProfileMeta {
  id: UserProfile;
  label: string;
  emoji: string;
  tagline: string;
  description: string;
}

export const PROFILE_META: ProfileMeta[] = [
  {
    id: "general",
    label: "Genel",
    emoji: "🌿",
    tagline: "Hepsi dengeli",
    description: "Nabız'ın tüm özelliklerini dengeli ve eksiksiz kullan.",
  },
  {
    id: "memory",
    label: "Hafıza Desteği",
    emoji: "🧠",
    tagline: "Karışıklık anında yardım",
    description: "Kimlik kartı, hatırlatıcılar ve 'Beni Eve Götür' ön planda.",
  },
  {
    id: "child",
    label: "Çocuk",
    emoji: "🧒",
    tagline: "Basit ve güvenli",
    description: "Anneni aramak ve kendini ifade etmek artık çok kolay.",
  },
  {
    id: "safety",
    label: "Kadın / Güvenlik",
    emoji: "🛡️",
    tagline: "Güvenlik ön planda",
    description: "Güvenli Yol Arkadaşı, konum paylaşımı ve SOS ön planda.",
  },
  {
    id: "senior",
    label: "Yaşlı",
    emoji: "🖐️",
    tagline: "Büyük ve sade",
    description: "Büyük harfler, büyük butonlar ve son derece sade bir arayüz.",
  },
  {
    id: "disabled",
    label: "Engelli",
    emoji: "♿",
    tagline: "Herkese uygun",
    description: "Erişilebilirlik araçları ve yüksek kontrast ön planda.",
  },
];

export const PROFILE_LABEL: Record<UserProfile, string> = Object.fromEntries(
  PROFILE_META.map((m) => [m.id, m.label]),
) as Record<UserProfile, string>;
