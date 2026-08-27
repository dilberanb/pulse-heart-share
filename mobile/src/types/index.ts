/**
 * Mobil uygulama için tip tanımları.
 * Web tarafındaki src/types ile birebir uyumludur.
 */

/** QuickCheck soru tipi */
export type QuickCheckQuestionType =
  | "how_are_you"
  | "are_you_available"
  | "are_you_safe"
  | "pet_needs"
  | "earthquake";

/** QuickCheck cevap anahtarları */
export type QuickCheckAnswer =
  | "all_good"
  | "not_good"
  | "available"
  | "busy"
  | "safe"
  | "not_safe"
  | "harmed"
  | "trapped"
  | "need_help"
  | "pet_fed"
  | "pet_needs_food"
  | "pet_emergency";

export interface QuickCheckAnswerOption {
  answer: QuickCheckAnswer;
  label: string;
  icon: string;
  statusColor: "green" | "amber" | "red";
}

export interface QuickCheckQuestion {
  id: string;
  type: QuickCheckQuestionType;
  label: string;
  icon: string;
  /** Günlük soru mu, yoksa "Diğer" sekmesinde mi? */
  section: "daily" | "other";
}

export interface QuickCheck {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  receiverName: string;
  questionType: QuickCheckQuestionType;
  status: "pending" | "answered";
  response?: QuickCheckResponse;
  createdAt: string;
  answeredAt?: string;
}

export interface QuickCheckResponse {
  id: string;
  checkId: string;
  senderId: string;
  receiverId: string;
  questionType: QuickCheckQuestionType;
  answer: QuickCheckAnswer;
  answerLabel: string;
  answerIcon: string;
  createdAt: string;
}

/** Aile üyesi / yakın çevre durumu */
export interface FamilyMemberStatus {
  id: string;
  name: string;
  relation: string;
  avatarUrl?: string;
  status: "safe" | "busy" | "problem" | "pending" | "unknown";
  statusLabel: string;
  batteryLevel: number;
  lastSeenAt: string;
  hasPendingCheck: boolean;
}

/** Pil durumu */
export interface BatteryStatus {
  percentage: number;
  isCharging: boolean;
  isLowBattery: boolean;
}

/** Güvenlik seviyesi */
export type StatusSeverity = "safe" | "warning" | "critical";

/** Erişilebilirlik rozetleri */
export type AccessibilityBadge =
  | "wheelchair_access"
  | "elevator_needed"
  | "sensory_overload"
  | "voice_assisted";

/** Evcil hayvan bakım görevi */
export interface PetCareTask {
  id: string;
  title: string;
  assignedToUserId?: string;
  status: "pending" | "completed";
}

/** Ephemeral veri — 12-24 saatlik zaman aşımı */
export interface EphemeralTTL {
  createdAt: string;
  expiresAt: string;
  isStale: boolean;
}
