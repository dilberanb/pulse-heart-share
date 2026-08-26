export type QuickCheckQuestionType = "how_are_you" | "are_you_available" | "are_you_safe" | "pet_needs" | "earthquake";

export interface QuickCheckQuestion {
  id: string;
  type: QuickCheckQuestionType;
  label: string;
  icon: string;
}

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

export interface QuickCheckAnswerOption {
  answer: QuickCheckAnswer;
  label: string;
  icon: string;
  statusColor: "green" | "amber" | "red";
}
