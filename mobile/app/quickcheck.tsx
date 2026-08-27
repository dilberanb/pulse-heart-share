import { useMemo, useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";

import { QUICK_CHECK_QUESTIONS } from "@/features/quickcheck/data/questions";
import { ANSWER_OPTIONS } from "@/features/quickcheck/data/answers";
import { MOCK_FAMILY_MEMBERS } from "@/features/quickcheck/data/mockData";
import { colors, radius, spacing } from "@/theme";

const QUESTION_STYLE: Record<string, { border: string; iconBg: string }> = {
  how_are_you: { border: "rgba(34,197,94,0.3)", iconBg: "rgba(34,197,94,0.12)" },
  are_you_available: { border: "rgba(168,85,247,0.3)", iconBg: "rgba(168,85,247,0.12)" },
  are_you_safe: { border: "rgba(59,130,246,0.3)", iconBg: "rgba(59,130,246,0.12)" },
  pet_needs: { border: "rgba(234,179,8,0.3)", iconBg: "rgba(234,179,8,0.12)" },
  earthquake: { border: "rgba(239,68,68,0.3)", iconBg: "rgba(239,68,68,0.12)" },
};

export default function QuickCheckScreen() {
  const router = useRouter();
  const { memberId } = useLocalSearchParams<{ memberId: string }>();
  const member = useMemo(
    () => MOCK_FAMILY_MEMBERS.find((m) => m.id === memberId) ?? MOCK_FAMILY_MEMBERS[0],
    [memberId],
  );
  const [showOther, setShowOther] = useState(false);
  const [sentType, setSentType] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const activeQuestions = showOther
    ? QUICK_CHECK_QUESTIONS.filter((q) => q.section === "other")
    : QUICK_CHECK_QUESTIONS.filter((q) => q.section === "daily");

  function sendQuestion(type: string) {
    setSentType(type);
    setTimeout(() => {
      setConfirmed(true);
      setTimeout(() => {
        setConfirmed(false);
        setSentType(null);
        router.back();
      }, 1500);
    }, 400);
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Başlık */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <View style={styles.titleRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{member?.name[0] ?? "?"}</Text>
          </View>
          <View>
            <Text style={styles.title}>{member?.name ?? ""} kontrol et</Text>
            <Text style={styles.subtitle}>{member?.relation ?? ""}</Text>
          </View>
        </View>
      </View>

      {confirmed && (
        <View style={styles.confirmedBox}>
          <Text style={styles.confirmedIcon}>✅</Text>
          <Text style={styles.confirmedText}>Gönderildi!</Text>
          <Text style={styles.confirmedSub}>
            {member?.name} cevapladığında bildirim alacaksın.
          </Text>
        </View>
      )}

      {!confirmed && (
        <>
          <Text style={styles.sectionLabel}>
            {showOther ? "Diğer Sorular" : "Günlük Sorular"}
          </Text>

          <View
            style={[
              styles.questionGrid,
              activeQuestions.length > 1 && styles.questionGridTwo,
            ]}
          >
            {activeQuestions.map((q) => {
              const style = QUESTION_STYLE[q.type] ?? QUESTION_STYLE.how_are_you;
              const answers = ANSWER_OPTIONS[q.type] ?? [];
              return (
                <Pressable
                  key={q.type}
                  onPress={() => sendQuestion(q.type)}
                  style={({ pressed }) => [
                    styles.questionCard,
                    { borderColor: style.border },
                    pressed && { opacity: 0.8 },
                    sentType === q.type && { opacity: 0.4 },
                  ]}
                >
                  <View style={[styles.questionIcon, { backgroundColor: style.iconBg }]}>
                    <Text style={styles.questionIconText}>{q.icon}</Text>
                  </View>
                  <Text style={styles.questionLabel}>{q.label}</Text>
                  <View style={styles.answerPreview}>
                    {answers.slice(0, 2).map((a) => (
                      <Text key={a.answer} style={styles.answerPreviewText}>
                        {a.icon} {a.label}
                      </Text>
                    ))}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Diğer sekmesi toggle */}
          <Pressable
            onPress={() => setShowOther((v) => !v)}
            style={styles.otherToggle}
          >
            <Text style={styles.otherToggleText}>
              {showOther ? "↩️ Günlük Sorular" : "⋯ Diğer (Evcil Hayvan, Deprem)"}
            </Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.xl },
  backBtn: { padding: 8 },
  backText: { color: colors.foreground, fontSize: 22, fontWeight: "700" },
  titleRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, flex: 1 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primarySoft,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 18, fontWeight: "700", color: colors.primary },
  title: { fontSize: 18, fontWeight: "800", color: colors.foreground },
  subtitle: { fontSize: 13, color: colors.foregroundMuted },

  sectionLabel: { fontSize: 16, fontWeight: "700", color: colors.foreground, marginBottom: spacing.md },
  questionGrid: { flexDirection: "column", gap: spacing.md },
  questionGridTwo: { flexDirection: "row", flexWrap: "wrap" },
  questionCard: {
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
    flex: 1,
    minWidth: "45%",
  },
  questionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  questionIconText: { fontSize: 28 },
  questionLabel: { fontSize: 15, fontWeight: "700", color: colors.foreground, textAlign: "center" },
  answerPreview: { marginTop: spacing.sm, gap: 2, alignItems: "center" },
  answerPreviewText: { fontSize: 11, color: colors.foregroundMuted },

  otherToggle: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
    marginTop: spacing.xl,
  },
  otherToggleText: { color: colors.foregroundMuted, fontSize: 13, fontWeight: "600" },

  confirmedBox: { alignItems: "center", paddingVertical: 60 },
  confirmedIcon: { fontSize: 56 },
  confirmedText: { fontSize: 20, fontWeight: "800", color: colors.safe, marginTop: spacing.md },
  confirmedSub: { fontSize: 13, color: colors.foregroundMuted, textAlign: "center", marginTop: spacing.sm },
});
