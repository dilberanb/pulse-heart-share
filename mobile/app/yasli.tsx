import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View, ScrollView } from "react-native";
import * as Haptics from "expo-haptics";

import { useAppStore } from "@/store/useAppStore";
import { colors, radius, spacing } from "@/theme";

export default function YasliScreen() {
  const router = useRouter();
  const setSeniorMode = useAppStore((s) => s.setSeniorMode);

  function activate() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSeniorMode(true);
    router.back();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>👵 Yaşlı Modu</Text>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>

      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Daha büyük, daha net</Text>
        <Text style={styles.heroDesc}>
          Yaşlı modu açıldığında butonlar ve yazılar büyür, ekran daha sade ve anlaşılır olur.
          En önemli üç özellik öne çıkar: SOS, Aile Kontrolü ve Durum Bildir.
        </Text>
      </View>

      <View style={styles.featureCard}>
        <Text style={styles.featureIcon}>🚨</Text>
        <Text style={styles.featureTitle}>SOS Butonu</Text>
        <Text style={styles.featureDesc}>Bir dokunuşla aile üyelerine haber verir.</Text>
      </View>
      <View style={styles.featureCard}>
        <Text style={styles.featureIcon}>👨‍👩‍👧</Text>
        <Text style={styles.featureTitle}>Aile Durumu</Text>
        <Text style={styles.featureDesc}>Ailece güvende misiniz görüntülenir.</Text>
      </View>
      <View style={styles.featureCard}>
        <Text style={styles.featureIcon}>✅</Text>
        <Text style={styles.featureTitle}>Durum Bildir</Text>
        <Text style={styles.featureDesc}>"İyiyim" de, ailen anında haberdar olsun.</Text>
      </View>

      <Pressable onPress={activate} style={styles.activateBtn}>
        <Text style={styles.activateText}>Yaşlı Modunu Aç</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: { fontSize: 20, fontWeight: "800", color: colors.foreground },
  closeBtn: { padding: 8 },
  closeText: { color: colors.foregroundMuted, fontSize: 18, fontWeight: "700" },

  hero: { alignItems: "center", marginBottom: spacing.xl },
  heroTitle: { fontSize: 24, fontWeight: "800", color: colors.foreground, textAlign: "center" },
  heroDesc: {
    color: colors.foregroundMuted,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.sm,
  },

  featureCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.md,
  },
  featureIcon: { fontSize: 34 },
  featureTitle: { fontSize: 18, fontWeight: "800", color: colors.foreground, marginTop: spacing.sm },
  featureDesc: { fontSize: 13, color: colors.foregroundMuted, textAlign: "center", marginTop: 4 },

  activateBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: "center",
    marginTop: spacing.lg,
  },
  activateText: { color: colors.primaryForeground, fontSize: 18, fontWeight: "800" },
});
