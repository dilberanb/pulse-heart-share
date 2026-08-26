import type {
  QuickCheckAnswer,
  QuickCheckAnswerOption,
  QuickCheckQuestion,
  QuickCheckQuestionType,
} from "@/types/quickcheck";

export const QUICK_CHECK_QUESTIONS: QuickCheckQuestion[] = [
  { id: "qc_how", type: "how_are_you", label: "Nasılsın?", icon: "💬" },
  { id: "qc_avail", type: "are_you_available", label: "Müsait misin?", icon: "📱" },
  { id: "qc_safe", type: "are_you_safe", label: "Güvenli misin?", icon: "🛡️" },
  { id: "qc_pet", type: "pet_needs", label: "Evcil hayvan durumu?", icon: "🐾" },
];

export const ANSWER_OPTIONS: Record<QuickCheckQuestionType, QuickCheckAnswerOption[]> = {
  how_are_you: [
    { answer: "all_good", label: "Her Şey Yolunda", icon: "🟢", statusColor: "green" },
    { answer: "something_wrong", label: "Bir Şeyler Var", icon: "🟡", statusColor: "amber" },
    { answer: "problem", label: "Sorun Var", icon: "🔴", statusColor: "red" },
    { answer: "need_help", label: "Yardım Lazım", icon: "🔴", statusColor: "red" },
  ],
  are_you_available: [
    { answer: "available", label: "Müsaitim", icon: "✅", statusColor: "green" },
    { answer: "busy", label: "Meşgulüm", icon: "❌", statusColor: "amber" },
    { answer: "later", label: "Daha Sonra", icon: "🕐", statusColor: "amber" },
    { answer: "need_help", label: "Yardım Lazım", icon: "🆘", statusColor: "red" },
  ],
  are_you_safe: [
    { answer: "safe", label: "Güvendeyim", icon: "🟢", statusColor: "green" },
    { answer: "not_home", label: "Evde Değilim", icon: "🟡", statusColor: "amber" },
    { answer: "harmed", label: "Zarar Gördüm", icon: "🔴", statusColor: "red" },
    { answer: "trapped", label: "Enkaz Altındayım", icon: "🔴", statusColor: "red" },
  ],
  pet_needs: [
    { answer: "pet_fed", label: "Beslendi", icon: "✅", statusColor: "green" },
    { answer: "pet_needs_food", label: "Beslenmedi", icon: "⚠️", statusColor: "amber" },
    { answer: "pet_emergency", label: "Acil Bakım Lazım", icon: "🆘", statusColor: "red" },
    { answer: "safe", label: "İyi", icon: "🟢", statusColor: "green" },
  ],
};

export const QUESTION_TYPE_LABELS: Record<QuickCheckQuestionType, string> = {
  how_are_you: "Nasılsın?",
  are_you_available: "Müsait misin?",
  are_you_safe: "Güvenli misin?",
  pet_needs: "Evcil hayvan durumu?",
};

export function getAnswerByType(
  questionType: QuickCheckQuestionType,
  answer: QuickCheckAnswer,
): QuickCheckAnswerOption | undefined {
  return ANSWER_OPTIONS[questionType]?.find((o) => o.answer === answer);
}
