/**
 * Alzheimer / Hafıza desteği — mock veri ve yardımcılar.
 * Bakım veren (aile üyesi) için: kaybolma riski, güvenli bölge, hatırlatıcılar.
 */

export interface MemoryProfile {
  id: string;
  name: string;
  /** Kimlik kartında gösterilecek güven ilişkileri */
  familyFacts: { label: string; value: string }[];
  address: string;
  homeGeocode: { lat: number; lng: number };
  /** Evden uzaklaşınca uyarı mesafesi (metre) */
  safeZoneRadiusMeters: number;
  caregiverPhone: string;
  caregiverName: string;
  bloodType?: string;
  allergies?: string;
  medications?: string;
}

export interface ReminderTask {
  id: string;
  title: string;
  time: string; // "09:00"
  icon: string;
  category: "medication" | "water" | "food" | "activity";
  done?: boolean;
}

/** Kaybolma bildirimi */
export interface MissingAlert {
  active: boolean;
  lastSeen: string;
  locationKnown: boolean;
  notifiedCaregiver: boolean;
}

export const MOCK_MEMORY_PROFILE: MemoryProfile = {
  id: "ppo",
  name: "Fatma",
  familyFacts: [
    { label: "Kızım", value: "Ayşe" },
    { label: "Oğlum", value: "Mehmet" },
    { label: "Torunum", value: "Elif" },
  ],
  address: "Atatürk Mah. 12. Sok. No:5, Düzce",
  homeGeocode: { lat: 40.8438, lng: 31.1565 },
  safeZoneRadiusMeters: 800,
  caregiverName: "Ayşe",
  caregiverPhone: "+905321234567",
  medications: "Kan basıncı ilacı (sabah 09:00)",
};

export const MOCK_REMINDERS: ReminderTask[] = [
  { id: "r1", title: "Tansiyon ilacını al", time: "09:00", icon: "💊", category: "medication" },
  { id: "r2", title: "Bir bardak su iç", time: "10:30", icon: "💧", category: "water" },
  { id: "r3", title: "Öğle yemeği", time: "12:30", icon: "🍽️", category: "food" },
  { id: "r4", title: "Kısa yürüyüş", time: "16:00", icon: "🚶", category: "activity" },
  { id: "r5", title: "Akşam ilacını al", time: "20:00", icon: "💊", category: "medication" },
];

/** Bugünün Türkçe tarih satırı — zaman oryantasyonu için */
export function todayTurkish(): string {
  return new Date().toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Şimdiki saat, ör. "14:32" */
export function nowTurkish(): string {
  return new Date().toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
