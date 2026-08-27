import { useState } from "react";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View, ScrollView, Switch, Alert } from "react-native";
import * as Haptics from "expo-haptics";

import { colors, radius, spacing } from "@/theme";
import { Card } from "@/components/ui";

const PROFILE = {
  name: "Fatma",
  address: "Atatürk Mah. 12. Sok. No:5, Düzce",
  family: [
    { label: "Kızım", value: "Ayşe" },
    { label: "Oğlum", value: "Mehmet" },
    { label: "Torunum", value: "Elif" },
  ],
};

const REMINDERS = [
  { id: "r1", title: "Tansiyon ilacını al", time: "09:00", icon: "💊" },
  { id: "r2", title: "Bir bardak su iç", time: "10:30", icon: "💧" },
  { id: "r3", title: "Öğle yemeği", time: "12:30", icon: "🍽️" },
  { id: "r4", title: "Akşam ilacını al", time: "20:00", icon: "💊" },
];

export default function AlzheimerScreen() {
  const router = useRouter();
  const [done, setDone] = useState<string[]>([]);

  const today = new Date().toLocaleDateString("tr-TR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const time = new Date().toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  function toggle(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDone((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  function call112() {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    Alert.alert("Kaybolma Bildirimi", "Bakım veren Ayşe'ye kaybolma bildirimi gönderildi. Son konum paylaşılıyor…");
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Hafıza Desteği</Text>
      </View>

      {/* Zaman oryantasyonu */}
      <Card style={styles.orientation}>
        <Text style={styles.orientationDate}>{today}</Text>
        <Text style={styles.orientationTime}>Saat {time}</Text>
      </Card>

      {/* Kimlik kartı */}
      <View style={styles.identityCard}>
        <View style={styles.identityTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{PROFILE.name[0]}</Text>
          </View>
          <Text style={styles.identityName}>Benim adım {PROFILE.name}</Text>
        </View>
        <Text style={styles.identityAddress}>Evim: {PROFILE.address}</Text>
        <View style={styles.familyRow}>
          {PROFILE.family.map((f) => (
            <View key={f.label} style={styles.familyChip}>
              <Text style={styles.familyLabel}>{f.label}</Text>
              <Text style={styles.familyValue}>{f.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Hatırlatıcılar */}
      <Text style={styles.sectionTitle}>Günlük Hatırlatıcılar</Text>
      {REMINDERS.map((r) => {
        const isDone = done.includes(r.id);
        return (
          <Pressable
            key={r.id}
            onPress={() => toggle(r.id)}
            style={[styles.reminderRow, isDone && { opacity: 0.5 }]}
          >
            <View style={styles.reminderIcon}>
              <Text style={{ fontSize: 20 }}>{r.icon}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.reminderTitle, isDone && { textDecorationLine: "line-through" }]}>
                {r.title}
              </Text>
              <Text style={styles.reminderTime}>{r.time}</Text>
            </View>
            <Text style={{ color: isDone ? colors.safe : colors.foregroundMuted, fontSize: 18 }}>
              {isDone ? "✓" : "○"}
            </Text>
          </Pressable>
        );
      })}

      {/* Güvenli bölge + kaybolma */}
      <Text style={styles.sectionTitle}>Güvenlik</Text>
      <Card>
        <Text style={styles.safeDesc}>
          {PROFILE.name} evden 800 metre uzaklaşırsa bakım veren otomatik bildirim alır.
        </Text>
        <View style={styles.actionRow}>
          <Pressable style={styles.actionBtn} onPress={call112}>
            <Text style={styles.actionText}>📍 Konum Paylaş</Text>
          </Pressable>
          <Pressable style={styles.actionBtn}>
            <Text style={styles.actionText}>🏠 Eve Götür (Rota)</Text>
          </Pressable>
        </View>
        <Pressable
          style={styles.missingBtn}
          onPress={() => {
            void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert("Kayboldu", "Bakım verene kaybolma bildirimi gönderildi.");
          }}
        >
          <Text style={styles.missingText}>🚨 Kayboldu — Bildir</Text>
        </Pressable>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg },
  backBtn: { padding: 8 },
  backText: { color: colors.foreground, fontSize: 22, fontWeight: "700" },
  title: { fontSize: 19, fontWeight: "800", color: colors.foreground },

  orientation: { marginBottom: spacing.md, alignItems: "center", paddingVertical: spacing.lg },
  orientationDate: { fontSize: 18, fontWeight: "800", color: colors.foreground },
  orientationTime: { fontSize: 13, color: colors.foregroundMuted, marginTop: 4 },

  identityCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.3)",
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  identityTop: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.md },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primarySoft,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: colors.primary, fontSize: 22, fontWeight: "900" },
  identityName: { fontSize: 18, fontWeight: "800", color: colors.foreground },
  identityAddress: { fontSize: 13, color: colors.foregroundMuted, marginBottom: spacing.md },
  familyRow: { flexDirection: "row", gap: spacing.sm },
  familyChip: {
    flex: 1,
    backgroundColor: colors.surfaceAlt,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: "center",
  },
  familyLabel: { fontSize: 11, color: colors.foregroundMuted },
  familyValue: { fontSize: 13, fontWeight: "700", color: colors.foreground, marginTop: 2 },

  sectionTitle: { fontSize: 15, fontWeight: "700", color: colors.foreground, marginBottom: spacing.sm, marginTop: spacing.md },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  reminderIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  reminderTitle: { fontSize: 14, fontWeight: "600", color: colors.foreground },
  reminderTime: { fontSize: 12, color: colors.foregroundMuted, marginTop: 2 },

  safeDesc: { fontSize: 13, color: colors.foregroundMuted, lineHeight: 19, marginBottom: spacing.md },
  actionRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  actionText: { color: colors.primary, fontSize: 13, fontWeight: "700" },
  missingBtn: {
    backgroundColor: colors.critical,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  missingText: { color: colors.white, fontSize: 14, fontWeight: "800" },
});
