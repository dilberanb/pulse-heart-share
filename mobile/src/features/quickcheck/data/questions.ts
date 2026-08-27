import type { QuickCheckQuestion } from "@/types";

/**
 * Günlük sorular — sade, net, 2 şıklı.
 * "Diğer" sekmesinde evcil hayvan ve deprem gibi özel sorular.
 */
export const QUICK_CHECK_QUESTIONS: QuickCheckQuestion[] = [
  { id: "qc_how", type: "how_are_you", label: "İyi misin?", icon: "💬", section: "daily" },
  { id: "qc_safe", type: "are_you_safe", label: "Güvende misin?", icon: "🛡️", section: "daily" },
  { id: "qc_avail", type: "are_you_available", label: "Müsait misin?", icon: "📱", section: "daily" },
  { id: "qc_pet", type: "pet_needs", label: "Evcil hayvan durumu?", icon: "🐾", section: "other" },
  { id: "qc_earthquake", type: "earthquake", label: "Deprem durumu?", icon: "🌍", section: "other" },
];

export const QUESTION_TYPE_LABELS: Record<string, string> = {
  how_are_you: "İyi misin?",
  are_you_available: "Müsait misin?",
  are_you_safe: "Güvende misin?",
  pet_needs: "Evcil hayvan durumu?",
  earthquake: "Deprem durumu?",
};
