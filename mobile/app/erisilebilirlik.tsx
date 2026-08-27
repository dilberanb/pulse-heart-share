import { useState } from "react";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import * as Haptics from "expo-haptics";

import { colors, radius, spacing } from "@/theme";
import { Card } from "@/components/ui";

const BADGES = [
  { id: "wheelchair", label: "Tekerlekli Sandalye", icon: "♿", color: colors.foregroundMuted },
  { id: "elevator", label: "Asansör Gerekli", icon: "🏢", color: colors.foregroundMuted },
  { id: "visual", label: "Görme Desteği", icon: "👁️", color: colors.foregroundMuted },
  { id: "hearing", label: "İşitme Desteği", icon: "🦻", color: colors.foregroundMuted },
  { id: "cognitive", label: "Bilişsel Destek", icon: "🧠", color: colors.foregroundMuted },
  { id: "mobility", label: "Hareket Kısıtlılığı", icon: "🤝", color: colors.foregroundMuted },
];

const PREFS = [
  { id: "big", label: "Büyük yazı ve yüksek kontrast" },
  { id: "touch", label: "Büyük dokunma hedefleri" },
  { id: "simple", label: "Basit dil / kısa cümleler" },
];

export default function ErisilebilirlikScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);
  const [prefs, setPrefs] = useState<string[]>([]);

  function toggleSelected(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  function togglePref(id: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPrefs((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Erişilebilirlik</Text>
      </View>

      <Card style={styles.intro}>
        <Text style={styles.introTitle}>Engelli Destek Rozetleri</Text>
        <Text style={styles.introDesc}>
          Aile üyelerin ve çevren, acil durumda nasıl yardım edeceğini bu rozetlerden öğrenir.
        </Text>
      </Card>

      <View style={styles.grid}>
        {BADGES.map((b) => {
          const active = selected.includes(b.id);
          return (
            <Pressable
              key={b.id}
              onPress={() => toggleSelected(b.id)}
              style={[
                styles.badgeCard,
                active
                  ? { borderColor: colors.primary, backgroundColor: colors.primarySoft }
                  : { borderColor: colors.borderSoft, backgroundColor: colors.surface },
              ]}
            >
              <Text style={styles.badgeIcon}>{b.icon}</Text>
              <Text style={[styles.badgeLabel, active && { color: colors.primary }]}>{b.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>Arayüz Tercihleri</Text>
      {PREFS.map((p) => {
        const on = prefs.includes(p.id);
        return (
          <Pressable
            key={p.id}
            onPress={() => togglePref(p.id)}
            style={styles.prefRow}
          >
            <Text style={styles.prefLabel}>{p.label}</Text>
            <View style={[styles.switchTrack, on && { backgroundColor: colors.primary }]}>
              <View style={[styles.switchThumb, on && { transform: [{ translateX: 20 }] }]} />
            </View>
          </Pressable>
        );
      })}
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

  intro: { marginBottom: spacing.lg },
  introTitle: { fontSize: 15, fontWeight: "700", color: colors.foreground },
  introDesc: { fontSize: 13, color: colors.foregroundMuted, lineHeight: 19, marginTop: spacing.sm },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  badgeCard: {
    width: "48%",
    flexGrow: 1,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
  },
  badgeIcon: { fontSize: 26 },
  badgeLabel: { fontSize: 12, fontWeight: "600", color: colors.foregroundMuted, textAlign: "center", marginTop: spacing.sm },

  sectionTitle: { fontSize: 15, fontWeight: "700", color: colors.foreground, marginBottom: spacing.sm, marginTop: spacing.xl },
  prefRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  prefLabel: { fontSize: 13, fontWeight: "600", color: colors.foreground, flex: 1 },
  switchTrack: {
    width: 46,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.surfaceAlt,
    padding: 2,
  },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.white,
  },
});
