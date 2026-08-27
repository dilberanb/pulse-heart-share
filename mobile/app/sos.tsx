import { useCallback, useState } from "react";
import { useRouter } from "expo-router";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Linking,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as Haptics from "expo-haptics";

import { EMERGENCY_LINES } from "@/features/emergency/data/emergencyLines";
import { useLocation, useOfflineSMSFallback, type GeoPoint } from "@/hooks/useLocation";
import { useLongPress } from "@/hooks/useLongPress";
import { MOCK_FAMILY_PHONES } from "@/features/quickcheck/data/mockData";
import { colors, radius, spacing } from "@/theme";

const LONG_PRESS_MS = 1500;

export default function SosScreen() {
  const router = useRouter();
  const { location, getCurrent } = useLocation();
  const { sendLocationSMS } = useOfflineSMSFallback();
  const [phase, setPhase] = useState<"idle" | "countdown" | "active">("idle");
  const [countdown, setCountdown] = useState(3);
  const [sending, setSending] = useState(false);

  // Uzun basma ile SOS tetikle
  const longPress = useLongPress({
    onTrigger: () => {
      void triggerSos();
    },
    duration: LONG_PRESS_MS,
    disabled: phase !== "idle",
  });

  const triggerSos = useCallback(async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setPhase("countdown");
    setCountdown(3);
    // 3 sn iptal edilebilir geri sayım
    for (let i = 2; i >= 0; i--) {
      await new Promise((r) => setTimeout(r, 1000));
      setCountdown(i);
    }
    setPhase("active");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    // Konumu al ve aileye SMS gönder
    const loc = await getCurrent();
    if (loc) {
      setSending(true);
      for (const member of MOCK_FAMILY_PHONES) {
        try {
          await sendLocationSMS(member.phone, loc);
        } catch {
          // tek tek hataları yoksay
        }
      }
      setSending(false);
    }
  }, [getCurrent, sendLocationSMS]);

  const cancelSos = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPhase("idle");
  }, []);

  async function shareLocation() {
    const loc = await getCurrent();
    if (!loc) {
      Alert.alert("Konum alınamadı", "Konum izni vermediğiniz için paylaşılamıyor.");
      return;
    }
    Alert.alert(
      "Konumum",
      `Konumum: ${loc.latitude.toFixed(6)}, ${loc.longitude.toFixed(6)}`,
      [{ text: "Haritada Aç", onPress: () => void openMap(loc) }, { text: "Kapat", style: "cancel" }],
    );
  }

  const openMap = useCallback((loc: GeoPoint) => {
    Linking.openURL(`https://maps.google.com/?q=${loc.latitude},${loc.longitude}`);
  }, []);

  const call112 = useCallback(() => {
    Linking.openURL("tel:112");
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Başlık */}
      <View style={styles.header}>
        <Text style={styles.title}>Güvenlik Merkezi</Text>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>

      {phase === "idle" && (
        <>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>Her şey kontrol altında</Text>
            <Text style={styles.heroDesc}>
              Acil bir durumda butonu 1.5 saniye basılı tut. Aile üyelerin ve acil servisler
              anında bilgilendirilir.
            </Text>
          </View>

          <View style={styles.longPressWrap}>
            <Pressable
              onPressIn={longPress.start}
              onPressOut={longPress.end}
              onPress={() => {}}
              style={({ pressed }) => [styles.sosButton, pressed && { transform: [{ scale: 0.96 }] }]}
            >
              {/* Basılı tutma ilerleme dolgusu */}
              {longPress.isPressing && (
                <View
                  style={[StyleSheet.absoluteFill, styles.sosProgress, { width: `${longPress.progress * 100}%` }]}
                />
              )}
              <Text style={styles.sosIcon}>🚨</Text>
              <Text style={styles.sosLabel}>SOS</Text>
              <Text style={styles.sosHint}>
                {longPress.isPressing ? `${Math.round(longPress.progress * 100)}% — bırakma...` : "1.5 sn basılı tut"}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>Ailem</Text>
          {MOCK_FAMILY_PHONES.map((m, idx) => (
            <Pressable
              key={m.id}
              onPress={() => Linking.openURL(`tel:${m.phone.replace("+", "")}`)}
              style={styles.familyRow}
            >
              <View style={styles.familyAvatar}>
                <Text style={styles.familyAvatarText}>{m.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.familyName}>{m.name}</Text>
                <Text style={styles.familyRelation}>{m.relation} · {idx + 1}. sıra</Text>
              </View>
              <Text style={styles.callText}>📞 Ara</Text>
            </Pressable>
          ))}

          <Text style={styles.sectionTitle}>Yardım Hatları</Text>
          <View style={styles.linesWrap}>
            {EMERGENCY_LINES.map((line) => (
              <Pressable
                key={line.id}
                onPress={() => Linking.openURL(`tel:${line.phone}`)}
                style={styles.lineCard}
              >
                <Text style={styles.lineIcon}>{line.icon === "phone" ? "📞" : line.icon === "heart" ? "💗" : line.icon === "hand" ? "🤝" : "⛰️"}</Text>
                <Text style={styles.linePhone}>{line.phone}</Text>
                <Text style={styles.lineName}>{line.name}</Text>
              </Pressable>
            ))}
          </View>
        </>
      )}

      {phase === "countdown" && (
        <View style={styles.centerBox}>
          <Text style={styles.countdownTitle}>Sakin ol, iptal edebilirsin</Text>
          <Text style={styles.countdownNumber}>{Math.max(countdown, 0)}</Text>
          <Text style={styles.countdownDesc}>Aile üyelerin bilgilendiriliyor…</Text>
          <Pressable onPress={cancelSos} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>İptal Et — Yanlışlıkla bastım</Text>
          </Pressable>
        </View>
      )}

      {phase === "active" && (
        <View style={styles.activeBox}>
          <Text style={styles.activeTitle}>Sakin ol, yardım yolda 🫀</Text>
          <Text style={styles.activeDesc}>Aile üyelerin ve acil servisler bilgilendirildi.</Text>

          {sending && (
            <View style={styles.sendingRow}>
              <ActivityIndicator color={colors.white} />
              <Text style={styles.sendingText}>Konumun aile üyelerine gönderiliyor…</Text>
            </View>
          )}

          <View style={styles.actionsWrap}>
            <Pressable onPress={shareLocation} style={styles.actionCard}>
              <Text style={styles.actionIcon}>📍</Text>
              <Text style={styles.actionLabel}>Konumumu Paylaş</Text>
            </Pressable>
            <Pressable
              onPress={() => location && openMap(location)}
              style={[styles.actionCard, !location && { opacity: 0.4 }]}
              disabled={!location}
            >
              <Text style={styles.actionIcon}>🧭</Text>
              <Text style={styles.actionLabel}>Rota Al</Text>
            </Pressable>
            <Pressable onPress={call112} style={[styles.actionCard, styles.actionCritical]}>
              <Text style={styles.actionIcon}>📞</Text>
              <Text style={styles.actionLabel}>112'yi Ara</Text>
            </Pressable>
          </View>

          <Pressable onPress={cancelSos} style={styles.imSafeBtn}>
            <Text style={styles.imSafeText}>Ben Güvendeyim — Durdur</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.critical },
  content: { padding: spacing.lg, paddingBottom: 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  title: { fontSize: 20, fontWeight: "800", color: colors.white },
  closeBtn: { padding: 8 },
  closeText: { color: colors.white, fontSize: 18, fontWeight: "700" },

  hero: { alignItems: "center", marginBottom: spacing.xl },
  heroTitle: { fontSize: 22, fontWeight: "800", color: colors.white },
  heroDesc: {
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    fontSize: 14,
    lineHeight: 20,
    marginTop: spacing.sm,
    maxWidth: 320,
  },

  longPressWrap: { alignItems: "center", marginBottom: spacing.xl },
  sosButton: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 4,
    borderColor: colors.white,
    backgroundColor: colors.critical,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  sosProgress: { backgroundColor: "rgba(255,255,255,0.25)", position: "absolute", left: 0, top: 0, bottom: 0 },
  sosIcon: { fontSize: 32 },
  sosLabel: { color: colors.white, fontSize: 34, fontWeight: "900", letterSpacing: 2 },
  sosHint: { color: "rgba(255,255,255,0.85)", fontSize: 12, fontWeight: "600", marginTop: 2 },

  sectionTitle: { color: colors.white, fontSize: 15, fontWeight: "800", marginTop: spacing.md, marginBottom: spacing.sm },

  familyRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  familyAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  familyAvatarText: { color: colors.white, fontSize: 18, fontWeight: "700" },
  familyName: { color: colors.white, fontSize: 14, fontWeight: "700" },
  familyRelation: { color: "rgba(255,255,255,0.7)", fontSize: 12 },
  callText: { color: colors.white, fontSize: 13, fontWeight: "700" },

  linesWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  lineCard: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    minWidth: 90,
    flex: 1,
  },
  lineIcon: { fontSize: 20 },
  linePhone: { color: colors.white, fontSize: 16, fontWeight: "800", marginTop: 4 },
  lineName: { color: "rgba(255,255,255,0.8)", fontSize: 11, textAlign: "center", marginTop: 2 },

  centerBox: { alignItems: "center", paddingVertical: 60 },
  countdownTitle: { color: colors.white, fontSize: 19, fontWeight: "700" },
  countdownNumber: { color: colors.white, fontSize: 80, fontWeight: "900", marginVertical: spacing.md },
  countdownDesc: { color: "rgba(255,255,255,0.85)", fontSize: 14 },
  cancelBtn: {
    marginTop: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  cancelText: { color: colors.critical, fontSize: 16, fontWeight: "800" },

  activeBox: { paddingVertical: spacing.lg },
  activeTitle: { color: colors.white, fontSize: 24, fontWeight: "900", textAlign: "center" },
  activeDesc: {
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
    fontSize: 14,
    marginTop: spacing.sm,
  },
  sendingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  sendingText: { color: colors.white, fontSize: 13, flex: 1 },
  actionsWrap: {
    flexDirection: "row",
    gap: spacing.sm,
    marginTop: spacing.xl,
    flexWrap: "wrap",
  },
  actionCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    minWidth: 100,
  },
  actionCritical: { backgroundColor: "rgba(255,255,255,0.3)" },
  actionIcon: { fontSize: 26 },
  actionLabel: { color: colors.white, fontSize: 13, fontWeight: "700", marginTop: spacing.sm, textAlign: "center" },
  imSafeBtn: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: "center",
    marginTop: spacing.xl,
  },
  imSafeText: { color: colors.critical, fontSize: 17, fontWeight: "800" },
});
