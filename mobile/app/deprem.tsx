import { useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View, ScrollView, Linking } from "react-native";

import { colors, radius, spacing } from "@/theme";
import { Badge, Card } from "@/components/ui";

const MOCK_EARTHQUAKE = {
  magnitude: 4.8,
  place: "Düzce Merkez, Düzce",
  time: new Date().toISOString(),
  status: "az_tehlikeli",
};

const STEPS = [
  { icon: "🛡️", title: "Çök-Kapan-Tutun", desc: "Sert bir masanın altına gir, başını koru, sarsıntı bitene kadar tutun." },
  { icon: "🏃", title: "Koşma", desc: "Deprem anında koşarak dışarı çıkmaya çalışma. Yer sarsılırken düşme riski çok yüksek." },
  { icon: "🔥", title: "Ateş yakma", desc: "Deprem sonrası ateş, mum veya çakmak kullanma — gaz sızıntısı olabilir." },
  { icon: "📍", title: "Buluşma noktanı bil", desc: "Ailenle önceden belirlediğin açık alan buluşma noktasına git." },
];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "az önce";
  return `${min} dk önce`;
}

export default function DepremScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Başlık */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </Pressable>
        <Text style={styles.title}>Deprem Bilinci</Text>
      </View>

      {/* Son deprem */}
      <Card style={styles.quakeCard}>
        <View style={styles.quakeTop}>
          <Text style={styles.magnitude}>M{MOCK_EARTHQUAKE.magnitude}</Text>
          <Badge label="Az tehlikeli" color="amber" />
        </View>
        <Text style={styles.quakePlace}>{MOCK_EARTHQUAKE.place}</Text>
        <Text style={styles.quakeTime}>{timeAgo(MOCK_EARTHQUAKE.time)} tespit edildi</Text>
      </Card>

      {/* Güvenli bölge haritası */}
      <Pressable
        onPress={() => Linking.openURL("https://deprem.afad.gov.tr/")}
        style={styles.mapCard}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.mapTitle}>📍 Güvenli bölge haritası</Text>
          <Text style={styles.mapDesc}>AFAD gerçek zamanlı deprem verileri</Text>
        </View>
        <Text style={styles.mapArrow}>→</Text>
      </Pressable>

      {/* Ne yapmalı */}
      <Text style={styles.sectionTitle}>Depremde Ne Yapmalı?</Text>
      {STEPS.map((step, i) => (
        <Card key={i} style={styles.stepCard}>
          <View style={styles.stepNum}>
            <Text style={styles.stepNumText}>{i + 1}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: spacing.md }}>
            <Text style={styles.stepTitle}>{step.icon} {step.title}</Text>
            <Text style={styles.stepDesc}>{step.desc}</Text>
          </View>
        </Card>
      ))}

      {/* Buluşma noktası */}
      <Text style={styles.sectionTitle}>Aile Buluşma Noktası</Text>
      <View style={styles.meetingWrap}>
        <Text style={styles.meetingEmpty}>
          Henüz bir buluşma noktası belirlemedin. Ailenle açık bir alan seçip buraya kaydedin.
        </Text>
      </View>
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

  quakeCard: { marginBottom: spacing.md },
  quakeTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  magnitude: { fontSize: 40, fontWeight: "900", color: colors.warning },
  quakePlace: { fontSize: 16, fontWeight: "700", color: colors.foreground, marginTop: spacing.sm },
  quakeTime: { fontSize: 12, color: colors.foregroundMuted, marginTop: 2 },

  mapCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.3)",
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },
  mapTitle: { fontSize: 15, fontWeight: "700", color: colors.primary },
  mapDesc: { fontSize: 12, color: colors.foregroundMuted, marginTop: 2 },
  mapArrow: { color: colors.primary, fontSize: 20, fontWeight: "700" },

  sectionTitle: { fontSize: 16, fontWeight: "700", color: colors.foreground, marginBottom: spacing.sm },
  stepCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
    padding: spacing.md,
  },
  stepNum: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.warningSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  stepNumText: { color: colors.warning, fontSize: 16, fontWeight: "800" },
  stepTitle: { fontSize: 14, fontWeight: "700", color: colors.foreground },
  stepDesc: { fontSize: 12, color: colors.foregroundMuted, marginTop: 2, lineHeight: 17 },

  meetingWrap: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: "center",
  },
  meetingEmpty: { fontSize: 13, color: colors.foregroundMuted, textAlign: "center", lineHeight: 19 },
});
