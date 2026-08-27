import type { QuickCheckAnswerOption } from "@/types";

/**
 * Soru tiplerine göre cevap seçenekleri.
 * Günlük sorular 2 şıklı (iyi/kötü), "Diğer" özel sorular daha detaylı.
 */
export const ANSWER_OPTIONS: Record<
  string,
  QuickCheckAnswerOption[]
> = {
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
