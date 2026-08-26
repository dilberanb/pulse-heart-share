import type {
  QuickCheckAnswer,
  QuickCheckAnswerOption,
  QuickCheckQuestion,
  QuickCheckQuestionType,
} from "@/types/quickcheck";

/** Günlük QuickCheck soruları — sade, net, iki seçenekli */
export const QUICK_CHECK_QUESTIONS: QuickCheckQuestion[] = [
  { id: "qc_how", type: "how_are_you", label: "İyi misin?", icon: "💬" },
  { id: "qc_safe", type: "are_you_safe", label: "Güvende misin?", icon: "🛡️" },
  { id: "qc_avail", type: "are_you_available", label: "Müsait misin?", icon: "📱" },
];

/** Diğer sorular — acil/özel durumlar için */
export const QUICK_CHECK_OTHER_QUESTIONS: QuickCheckQuestion[] = [
  { id: "qc_pet", type: "pet_needs", label: "Evcil hayvan durumu?", icon: "🐾" },
  { id: "qc_earthquake", type: "earthquake", label: "Deprem durumu?", icon: "🌍" },
];

/** Günlük soruların cevap seçenekleri — sadece 2 şık */
export const ANSWER_OPTIONS: Record<QuickCheckQuestionType, QuickCheckAnswerOption[]> = {
  how_are_you: [
    { answer: "all_good", label: "İyiyim", icon: "🟢", statusColor: "green" },
    { answer: "not_good", label: "İyi Değilim", icon: "🔴", statusColor: "red" },
  ],
  are_you_available: [
    { answer: "available", label: "Müsaitim", icon: "🟢", statusColor: "green" },
    { answer: "busy", label: "Müsait Değilim", icon: "🔴", statusColor: "red" },
  ],
  are_you_safe: [
    { answer: "safe", label: "Güvendeyim", icon: "🟢", statusColor: "green" },
    { answer: "not_safe", label: "Güvende Değilim", icon: "🔴", statusColor: "red" },
  ],
  pet_needs: [
    { answer: "pet_fed", label: "Beslendi", icon: "✅", statusColor: "green" },
    { answer: "pet_needs_food", label: "Beslenmedi", icon: "⚠️", statusColor: "amber" },
    { answer: "pet_emergency", label: "Acil Bakım Lazım", icon: "🆘", statusColor: "red" },
  ],
  earthquake: [
    { answer: "safe", label: "Güvendeyim", icon: "🟢", statusColor: "green" },
    { answer: "harmed", label: "Zarar Gördüm", icon: "🔴", statusColor: "red" },
    { answer: "trapped", label: "Enkaz Altındayım", icon: "🔴", statusColor: "red" },
    { answer: "need_help", label: "Yardım Lazım", icon: "🆘", statusColor: "red" },
  ],
};

export const QUESTION_TYPE_LABELS: Record<QuickCheckQuestionType, string> = {
  how_are_you: "İyi misin?",
  are_you_available: "Müsait misin?",
  are_you_safe: "Güvende misin?",
  pet_needs: "Evcil hayvan durumu?",
  earthquake: "Deprem durumu?",
};

export function getAnswerByType(
  questionType: QuickCheckQuestionType,
  answer: QuickCheckAnswer,
): QuickCheckAnswerOption | undefined {
  return ANSWER_OPTIONS[questionType]?.find((o) => o.answer === answer);
}
