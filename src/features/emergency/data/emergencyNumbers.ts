import {
  Ambulance,
  Flame,
  Shield,
  ShieldAlert,
  Heart,
  Phone,
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

export const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  {
    id: "112",
    name: "Acil Sağlık",
    phone: "112",
    description: "Ambulans, acil tıbbi müdahale",
    icon: Ambulance,
    category: "primary",
    telHref: "tel:112",
  },
  {
    id: "110",
    name: "İtfaiye",
    phone: "110",
    description: "Yangın, kurtarma ve AFAD desteği",
    icon: Flame,
    category: "primary",
    telHref: "tel:110",
  },
  {
    id: "155",
    name: "Polis İmdat",
    phone: "155",
    description: "Güvenlik, suç ihbarı",
    icon: Shield,
    category: "primary",
    telHref: "tel:155",
  },
  {
    id: "156",
    name: "Jandarma",
    phone: "156",
    description: "Kırsal alan güvenlik ihbarı",
    icon: ShieldAlert,
    category: "primary",
    telHref: "tel:156",
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
