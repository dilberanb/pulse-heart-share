import type { MissingProfile } from "@/features/missing/types";

/**
 * Kayıp ilan edilebilecek kişiler ve evcil hayvanlar.
 * Fotoğraflar mock'tur (kişi avatarları initials, hayvanlar emoji).
 */
export const MISSING_PEOPLE: MissingProfile[] = [
  {
    id: "baba",
    kind: "person",
    name: "Mehmet Yılmaz",
    ageLabel: "68",
    subtitle: "Baba",
    detail: "1.78 m · kahverengi göz",
    homeAddress: "Atatürk Mah. 12. Sok. No:5, Düzce",
    contact: "0532 123 45 67",
    lastSeenPlace: "Çarşı — Düzce Merkez",
    lastSeenTime: "10:42",
    description:
      "Mavi kazak, bej pantolon ve gri şapka giyiyor. Alzheimer hastası; yönünü bulmakta zorlanıyor. Son konum Payitaht Çarşısı çevresinde alındı.",
  },
  {
    id: "anne",
    kind: "person",
    name: "Ayşe Yılmaz",
    ageLabel: "64",
    subtitle: "Anne",
    detail: "1.62 m · kısa kumral saç",
    homeAddress: "Atatürk Mah. 12. Sok. No:5, Düzce",
    contact: "0532 123 45 67",
    lastSeenPlace: "Sentamerkez Parkı",
    lastSeenTime: "09:15",
    description:
      "Bordo mont giyiyor. Sabah yürüyüşüne çıktı, dönmedi. Son sinyal park çevresinde alındı.",
  },
  {
    id: "fatma-nine",
    kind: "person",
    name: "Fatma Yılmaz",
    ageLabel: "82",
    subtitle: "Babaanne",
    detail: "1.55 m · beyaz saç, baston",
    homeAddress: "Merkez Mah. Kültür Sok. No:3, Düzce",
    contact: "0532 123 45 67",
    lastSeenPlace: "Kızılay Şubesi önü",
    lastSeenTime: "11:20",
    description:
      "Uzun mavi etek ve siyah hırka giyiyor. Hafıza kaybı var. Son sinyal şehir merkezinde alındı.",
  },
];

export const MISSING_PETS: MissingProfile[] = [
  {
    id: "pamuk",
    kind: "pet",
    name: "Pamuk",
    ageLabel: "3 yaş",
    subtitle: "Köpek",
    detail: "Golden Retriever",
    emoji: "🐕",
    homeAddress: "Atatürk Mah. 12. Sok. No:5, Düzce",
    contact: "0532 123 45 67",
    lastSeenPlace: "Yıllık Parkı girişi",
    lastSeenTime: "08:50",
    description:
      "Krem rengi Golden Retriever. Boynunda kırmızı tasma ve 'Pamuk' yazılı künye var. Çok uysal, insanlara yaklaşır.",
  },
  {
    id: "mirnav",
    kind: "pet",
    name: "Mırnav",
    ageLabel: "2 yaş",
    subtitle: "Kedi",
    detail: "Tekir",
    emoji: "🐱",
    homeAddress: "Merkez Mah. Kültür Sok. No:3, Düzce",
    contact: "0532 123 45 67",
    lastSeenPlace: "Apartman önü",
    lastSeenTime: "Gece 23:10",
    description:
      "Gri tekir, yeşil gözlü. Kulağında mikroçip var. Ev kedisi, dışarıda gece tek başına kalması normal değil.",
  },
];
