/**
 * Türkiye acil durum hatları.
 * 2024 sonrası: Tüm acil durumlar (polis, itfaiye, ambulans, afet) 112'de birleşti.
 * Yardımcı/destek hatları ayrı listelenir.
 */
export interface EmergencyLine {
  id: string;
  name: string;
  phone: string;
  description: string;
  icon: "phone" | "heart" | "hand" | "mountain";
  category: "primary" | "support";
}

export const EMERGENCY_LINES: EmergencyLine[] = [
  {
    id: "112",
    name: "Acil Durum (112)",
    phone: "112",
    description: "Ambulans · Polis · İtfaiye · Afet — hepsi tek numara",
    icon: "phone",
    category: "primary",
  },
  {
    id: "alo183",
    name: "ALO 183",
    phone: "183",
    description: "Sosyal Destek Hattı",
    icon: "hand",
    category: "support",
  },
  {
    id: "kades",
    name: "KADES",
    phone: "183",
    description: "Kadın Acil Destek",
    icon: "heart",
    category: "support",
  },
  {
    id: "afad",
    name: "AFAD",
    phone: "122",
    description: "Afet ve Acil Durum Yönetimi",
    icon: "mountain",
    category: "support",
  },
];
