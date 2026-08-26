import type {
  FamilyMemberStatus,
  QuickCheck,
  QuickCheckAnswer,
  QuickCheckAnswerOption,
  QuickCheckQuestionType,
  QuickCheckResponse,
} from "@/types/quickcheck";
import { ANSWER_OPTIONS } from "@/features/quickcheck/data/questions";

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

let familyMembers: FamilyMemberStatus[] = [
  {
    id: "p1",
    name: "Ayşe Yılmaz",
    relation: "Anne",
    status: "safe",
    statusLabel: "Güvende",
    batteryLevel: 87,
    lastSeenAt: new Date(Date.now() - 2 * MINUTE).toISOString(),
    hasPendingCheck: false,
  },
  {
    id: "p2",
    name: "Mehmet Yılmaz",
    relation: "Baba",
    status: "busy",
    statusLabel: "Meşgul",
    batteryLevel: 45,
    lastSeenAt: new Date(Date.now() - 15 * MINUTE).toISOString(),
    hasPendingCheck: false,
  },
  {
    id: "p3",
    name: "Elif Yılmaz",
    relation: "Kardeş",
    status: "pending",
    statusLabel: "Cevap bekliyor",
    batteryLevel: 92,
    lastSeenAt: new Date(Date.now() - 5 * MINUTE).toISOString(),
    hasPendingCheck: true,
  },
  {
    id: "p4",
    name: "Zeynep Kaya",
    relation: "En yakın arkadaş",
    status: "problem",
    statusLabel: "Sorun var",
    batteryLevel: 12,
    lastSeenAt: new Date(Date.now() - 45 * MINUTE).toISOString(),
    hasPendingCheck: false,
  },
  {
    id: "p5",
    name: "Fatma Nine",
    relation: "Babaanne",
    status: "safe",
    statusLabel: "Güvende",
    batteryLevel: 68,
    lastSeenAt: new Date(Date.now() - 2 * HOUR).toISOString(),
    hasPendingCheck: false,
  },
  {
    id: "p6",
    name: "Can Demir",
    relation: "Arkadaş",
    status: "unknown",
    statusLabel: "Durum bilinmiyor",
    batteryLevel: 95,
    lastSeenAt: new Date(Date.now() - 90 * MINUTE).toISOString(),
    hasPendingCheck: true,
  },
];

let checkHistory: QuickCheck[] = [
  {
    id: "qc-1",
    senderId: "me",
    senderName: "Sen",
    receiverId: "p1",
    receiverName: "Ayşe Yılmaz",
    questionType: "how_are_you",
    status: "answered",
    response: {
      id: "qcr-1",
      checkId: "qc-1",
      senderId: "me",
      receiverId: "p1",
      questionType: "how_are_you",
      answer: "all_good",
      answerLabel: "Her Şey Yolunda",
      answerIcon: "🟢",
      createdAt: new Date(Date.now() - 30 * MINUTE).toISOString(),
    },
    createdAt: new Date(Date.now() - 35 * MINUTE).toISOString(),
    answeredAt: new Date(Date.now() - 30 * MINUTE).toISOString(),
  },
  {
    id: "qc-2",
    senderId: "me",
    senderName: "Sen",
    receiverId: "p4",
    receiverName: "Zeynep Kaya",
    questionType: "are_you_safe",
    status: "answered",
    response: {
      id: "qcr-2",
      checkId: "qc-2",
      senderId: "me",
      receiverId: "p4",
      questionType: "are_you_safe",
      answer: "harmed",
      answerLabel: "Zarar Gördüm",
      answerIcon: "🔴",
      createdAt: new Date(Date.now() - 50 * MINUTE).toISOString(),
    },
    createdAt: new Date(Date.now() - 55 * MINUTE).toISOString(),
    answeredAt: new Date(Date.now() - 50 * MINUTE).toISOString(),
  },
  {
    id: "qc-3",
    senderId: "p3",
    senderName: "Elif Yılmaz",
    receiverId: "me",
    receiverName: "Sen",
    questionType: "are_you_available",
    status: "answered",
    response: {
      id: "qcr-3",
      checkId: "qc-3",
      senderId: "p3",
      receiverId: "me",
      questionType: "are_you_available",
      answer: "available",
      answerLabel: "Müsaitim",
      answerIcon: "✅",
      createdAt: new Date(Date.now() - 2 * HOUR).toISOString(),
    },
    createdAt: new Date(Date.now() - 3 * HOUR).toISOString(),
    answeredAt: new Date(Date.now() - 2 * HOUR).toISOString(),
  },
  {
    id: "qc-4",
    senderId: "me",
    senderName: "Sen",
    receiverId: "p6",
    receiverName: "Can Demir",
    questionType: "pet_needs",
    status: "pending",
    createdAt: new Date(Date.now() - 20 * MINUTE).toISOString(),
  },
  {
    id: "qc-5",
    senderId: "me",
    senderName: "Sen",
    receiverId: "p3",
    receiverName: "Elif Yılmaz",
    questionType: "how_are_you",
    status: "pending",
    createdAt: new Date(Date.now() - 10 * MINUTE).toISOString(),
  },
];

export async function fetchFamilyMembers(): Promise<FamilyMemberStatus[]> {
  await delay();
  return [...familyMembers];
}

export async function fetchPendingChecks(): Promise<QuickCheck[]> {
  await delay(200);
  return checkHistory.filter((c) => c.status === "pending" && c.senderId === "me");
}

export async function fetchPendingReceivedChecks(): Promise<QuickCheck[]> {
  await delay(200);
  return checkHistory.filter((c) => c.status === "pending" && c.receiverId === "me");
}

export async function fetchCheckHistory(): Promise<QuickCheck[]> {
  await delay(300);
  return [...checkHistory].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function sendQuickCheck(
  receiverId: string,
  receiverName: string,
  questionType: QuickCheckQuestionType,
): Promise<QuickCheck> {
  await delay(300);
  const check: QuickCheck = {
    id: `qc-${Date.now()}`,
    senderId: "me",
    senderName: "Sen",
    receiverId,
    receiverName,
    questionType,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  checkHistory = [check, ...checkHistory];
  const member = familyMembers.find((m) => m.id === receiverId);
  if (member) {
    member.hasPendingCheck = true;
    member.status = "pending";
    member.statusLabel = "Cevap bekliyor";
  }
  return check;
}

export async function answerQuickCheck(
  checkId: string,
  senderId: string,
  senderName: string,
  questionType: QuickCheckQuestionType,
  answer: QuickCheckAnswer,
): Promise<QuickCheckResponse> {
  await delay(250);
  const answerOption = ANSWER_OPTIONS[questionType]?.find((o) => o.answer === answer);
  const response: QuickCheckResponse = {
    id: `qcr-${Date.now()}`,
    checkId,
    senderId: "me",
    receiverId: senderId,
    questionType,
    answer,
    answerLabel: answerOption?.label ?? answer,
    answerIcon: answerOption?.icon ?? "❓",
    createdAt: new Date().toISOString(),
  };

  checkHistory = checkHistory.map((c) => {
    if (c.id !== checkId) return c;
    return {
      ...c,
      status: "answered" as const,
      response,
      answeredAt: new Date().toISOString(),
    };
  });

  const member = familyMembers.find((m) => m.id === senderId);
  if (member) {
    member.hasPendingCheck = false;
    const statusMap: Record<string, FamilyMemberStatus["status"]> = {
      all_good: "safe",
      safe: "safe",
      available: "safe",
      busy: "busy",
      something_wrong: "problem",
      problem: "problem",
      need_help: "problem",
      later: "busy",
      not_home: "unknown",
      harmed: "problem",
      trapped: "problem",
      pet_fed: "safe",
      pet_needs_food: "busy",
      pet_emergency: "problem",
    };
    member.status = statusMap[answer] ?? "unknown";
    member.statusLabel = answerOption?.label ?? "Bilinmiyor";
  }

  return response;
}
