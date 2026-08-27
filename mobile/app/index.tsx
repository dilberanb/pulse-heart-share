import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View, Pressable, FlatList } from "react-native";

import { BatteryIndicator, Badge, Card } from "@/components/ui";
import { useBatteryMonitor } from "@/hooks/useBatteryMonitor";
import { useAppStore } from "@/store/useAppStore";
import { MOCK_FAMILY_MEMBERS } from "@/features/quickcheck/data/mockData";
import type { FamilyMemberStatus } from "@/types";
import { colors, radius, spacing } from "@/theme";

const STATUS_COLOR: Record<FamilyMemberStatus["status"], string> = {
  safe: colors.safe,
  busy: colors.warning,
  problem: colors.critical,
  pending: colors.warning,
  unknown: colors.foregroundDim,
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Şimdi";
  if (min < 60) return `${min} dk önce`;
  const hr = Math.floor(min / 60);
  return `${hr} sa önce`;
}

function MemberCard({ member, onOpen }: { member: FamilyMemberStatus; onOpen: (m: FamilyMemberStatus) => void }) {
  const color = STATUS_COLOR[member.status];
  return (
    <Card
      style={styles.memberCard}
      onPress={() => onOpen(member)}
    >
      <View style={styles.memberTop}>
        <View style={styles.avatarRow}>
          {/* Avatar placeholder */}
          <View style={[styles.avatar, { borderColor: color }]}>
            <Text style={styles.avatarText}>{member.name[0]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.memberName}>{member.name}</Text>
            <Text style={styles.memberRelation}>{member.relation}</Text>
          </View>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <View style={[styles.statusDot, { backgroundColor: color }]} />
          <Text style={[styles.statusLabel, { color }]}>{member.statusLabel}</Text>
        </View>
      </View>
      <View style={styles.memberMeta}>
        <BatteryIndicator level={member.batteryLevel} />
        <Text style={styles.lastSeen}>{relativeTime(member.lastSeenAt)}</Text>
      </View>
    </Card>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const battery = useBatteryMonitor();
  const seniorMode = useAppStore((s) => s.seniorMode);

  const safeCount = MOCK_FAMILY_MEMBERS.filter((m) => m.status === "safe").length;
  const pendingCount = MOCK_FAMILY_MEMBERS.filter((m) => m.status === "pending").length;
  const problemCount = MOCK_FAMILY_MEMBERS.filter((m) => m.status === "problem").length;

  const sorted = [...MOCK_FAMILY_MEMBERS].sort((a, b) => {
    const order: Record<string, number> = { problem: 0, pending: 1, unknown: 2, busy: 3, safe: 4 };
    return order[a.status] - order[b.status];
  });

  const openQuickCheck = (member: FamilyMemberStatus) => {
    router.push({ pathname: "/quickcheck", params: { memberId: member.id } });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Üst bilgi — kendi durumumuz + pil */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Nabız</Text>
          <Text style={styles.subtitle}>Aile ve yakınların güvende mi?</Text>
        </View>
        <BatteryIndicator level={battery.percentage} charging={battery.isCharging} />
      </View>

      {/* SOS butonu */}
      <Pressable
        onPress={() => router.push("/sos")}
        style={({ pressed }) => [styles.sosButton, pressed && { opacity: 0.9 }]}
      >
        <Text style={styles.sosText}>🚨 SOS — Güvenlik Merkezi</Text>
        <Text style={styles.sosHint}>Acil durumda dokun</Text>
      </Pressable>

      {/* Yaşlı modu kısayolu */}
      {!seniorMode && (
        <Pressable onPress={() => router.push("/yasli")} style={styles.seniorLink}>
          <Text style={styles.seniorLinkText}>👵 Yaşlılar için büyük buton modu</Text>
        </Pressable>
      )}

      {/* QuickCheck özeti */}
      <Card style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryGreen}>✓ {safeCount} güvende</Text>
          <Text style={styles.summaryAmber}>⏳ {pendingCount} bekliyor</Text>
          <Text style={styles.summaryRed}>! {problemCount} sorunlu</Text>
        </View>
      </Card>

      {/* Aile listesi */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Ailem ve Yakınlarım</Text>
        <Text style={styles.sectionCount}>{sorted.length} kişi</Text>
      </View>

      {sorted.map((m) => (
        <MemberCard key={m.id} member={m} onOpen={openQuickCheck} />
      ))}
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
  title: { fontSize: 26, fontWeight: "800", color: colors.foreground },
  subtitle: { fontSize: 13, color: colors.foregroundMuted, marginTop: 2 },
  sosButton: {
    backgroundColor: colors.critical,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  sosText: { color: colors.white, fontSize: 17, fontWeight: "800" },
  sosHint: { color: "rgba(255,255,255,0.8)", fontSize: 12, marginTop: 4 },
  seniorLink: { paddingVertical: spacing.sm, marginBottom: spacing.md },
  seniorLinkText: { color: colors.primary, fontSize: 13, fontWeight: "600" },
  summaryCard: { marginBottom: spacing.lg },
  summaryRow: { flexDirection: "row", justifyContent: "space-around" },
  summaryGreen: { color: colors.safe, fontWeight: "700", fontSize: 13 },
  summaryAmber: { color: colors.warning, fontWeight: "700", fontSize: 13 },
  summaryRed: { color: colors.critical, fontWeight: "700", fontSize: 13 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: colors.foreground },
  sectionCount: { fontSize: 12, color: colors.foregroundMuted },
  memberCard: { marginBottom: spacing.md },
  memberTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  avatarRow: { flexDirection: "row", alignItems: "center", gap: spacing.md, flex: 1 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surfaceAlt,
  },
  avatarText: { fontSize: 18, fontWeight: "700", color: colors.foreground },
  memberName: { fontSize: 15, fontWeight: "700", color: colors.foreground },
  memberRelation: { fontSize: 12, color: colors.foregroundMuted, marginTop: 1 },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 4 },
  statusLabel: { fontSize: 11, fontWeight: "700" },
  memberMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderSoft,
  },
  lastSeen: { fontSize: 12, color: colors.foregroundMuted },
});
