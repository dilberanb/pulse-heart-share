/**
 * Acil durum eylemleri (Emergency Actions).
 * "Mahsur kaldım", "Kaza yaptım", "Panik atak geçiriyorum" gibi durumları
 * ayrıştırıp, kullanıcının seçtiği kişilerle paylaşmak için kullanılır.
 * Her durumun, gerekliliğine göre bir "davranışı" vardır:
 *  - notification : anlık bildirim (acil haber)
 *  - location     : konum paylaşımı da içerir
 *  - notification+location : hem bildirim hem konum
 */

export type EmergencyKind =
  | "stranded" // Mahsur kaldım
  | "accident" // Kaza yaptım
  | "panicattack" // Panik atak geçiriyorum
  | "sick" // Kendimi kötü hissediyorum
  | "lost" // Kayboldum / yön bulamıyorum
  | "danger"; // Tehlikedeyim

export type EmergencyBehavior = "notification" | "location" | "location+notification";

export interface EmergencyAction {
  id: EmergencyKind;
  label: string;
  emoji: string;
  /** Durumun içerdiği davranış: anlık bildirim mi, konum mu, ikisi de mi? */
  behavior: EmergencyBehavior;
  description: string;
  /** Acil (ürjgent) durum — 'everyone'a yayınlanabilir. */
  urgent: boolean;
}

export const EMERGENCY_ACTIONS: EmergencyAction[] = [
  {
    id: "stranded",
    label: "Mahsur kaldım",
    emoji: "🧭",
    behavior: "location+notification",
    description: "Yolda ya da bir yerde mahsur kaldım, konumumu paylaşıyorum.",
    urgent: true,
  },
  {
    id: "accident",
    label: "Kaza geçirdim",
    emoji: "💥",
    behavior: "location+notification",
    description: "Bir kaza geçirdim, anında bilgilendir",
    urgent: true,
  },
  {
    id: "panicattack",
    label: "Panik atak geçiriyorum",
    emoji: "😰",
    behavior: "notification",
    description: "Panik/kriz anındayım, yanımda olun ya da arayın.",
    urgent: true,
  },
  {
    id: "lost",
    label: "Kayboldum / yön bulamıyorum",
    emoji: "🧭",
    behavior: "location",
    description: "Nerede olduğumu bilmiyorum, konumumu paylaşıyorum.",
    urgent: true,
  },
  {
    id: "sick",
    label: "Kendimi kötü hissediyorum",
    emoji: "🤒",
    behavior: "notification",
    description: "İyi değilim, benimle ilgilenir misiniz?",
    urgent: false,
  },
  {
    id: "danger",
    label: "Tehlikedeyim",
    emoji: "⚠️",
    behavior: "location+notification",
    description: "Kendimi güvende hissetmiyorum, hemen yardım.",
    urgent: true,
  },
];
