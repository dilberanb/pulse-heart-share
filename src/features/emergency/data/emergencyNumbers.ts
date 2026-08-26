import {
  Phone,
  Heart,
  HandHelping,
  MountainSnow,
  type LucideIcon,
} from "lucide-react";

export interface EmergencyNumber {
  id: string;
  name: string;
  phone: string;
  description: string;
  icon: LucideIcon;
  category: "primary" | "support" | "specialized";
  telHref: string;
}

/**
 * Türkiye'de tüm acil durumlar 112 numaralı hatta yönlendirilir.
 * 112, polis, jandarma, itfaiye, ambulans ve AFAD için evrensel acil hattır.
 */
export const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  {
    id: "112",
    name: "Acil Durum (112)",
    phone: "112",
    description: "Ambulans, polis, itfaiye — tüm acil durumlar",
    icon: Phone,
    category: "primary",
    telHref: "tel:112",
  },
  {
    id: "kades",
    name: "KADES",
    phone: "183",
    description: "Kadın Acil Destek Uygulaması",
    icon: Heart,
    category: "specialized",
    telHref: "tel:183",
  },
  {
    id: "alo183",
    name: "ALO 183",
    phone: "183",
    description: "Sosyal Destek Hattı",
    icon: HandHelping,
    category: "support",
    telHref: "tel:183",
  },
  {
    id: "afad",
    name: "AFAD",
    phone: "122",
    description: "Afet ve Acil Durum Yönetimi",
    icon: MountainSnow,
    category: "support",
    telHref: "tel:122",
  },
];

export const PRIMARY_EMERGENCY_NUMBERS = EMERGENCY_NUMBERS.filter(
  (n) => n.category === "primary",
);

export const SUPPORT_EMERGENCY_NUMBERS = EMERGENCY_NUMBERS.filter(
  (n) => n.category !== "primary",
);
