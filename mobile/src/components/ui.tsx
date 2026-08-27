import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle, type TextStyle } from "react-native";

import { colors, radius, spacing } from "@/theme";

/* ── Card ─────────────────────────────────────────────── */
export function Card({
  children,
  style,
  onPress,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}) {
  const Comp = onPress ? Pressable : View;
  return (
    <Comp
      onPress={onPress}
      style={[styles.card, style]}
      {...(onPress ? { android_ripple: { color: "rgba(255,255,255,0.05)" } } : {})}
    >
      {children}
    </Comp>
  );
}

/* ── Button ───────────────────────────────────────────── */
type ButtonVariant = "primary" | "outline" | "critical" | "ghost";

export function Button({
  title,
  onPress,
  variant = "primary",
  style,
  textStyle,
  disabled,
  children,
}: {
  title?: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  children?: ReactNode;
}) {
  const bg =
    variant === "primary"
      ? styles.btnPrimary
      : variant === "critical"
        ? styles.btnCritical
        : variant === "outline"
          ? styles.btnOutline
          : styles.btnGhost;
  const fg =
    variant === "primary"
      ? { color: colors.primaryForeground }
      : variant === "critical"
        ? { color: colors.white }
        : { color: colors.foreground };
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        bg,
        pressed && { opacity: 0.8 },
        disabled && { opacity: 0.5 },
        style,
      ]}
    >
      {children}
      {title !== undefined && <Text style={[styles.btnText, fg, textStyle]}>{title}</Text>}
    </Pressable>
  );
}

/* ── Badge ────────────────────────────────────────────── */
export function Badge({
  label,
  color = "green",
  style,
}: {
  label: string;
  color?: "green" | "amber" | "red" | "blue" | "muted";
  style?: StyleProp<ViewStyle>;
}) {
  const palette = {
    green: { bg: "rgba(34,197,94,0.14)", fg: "#4ade80" },
    amber: { bg: "rgba(234,179,8,0.14)", fg: "#facc15" },
    red: { bg: "rgba(239,68,68,0.14)", fg: "#f87171" },
    blue: { bg: "rgba(59,130,246,0.14)", fg: "#60a5fa" },
    muted: { bg: colors.surfaceAlt, fg: colors.foregroundMuted },
  }[color];
  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }, style]}>
      <Text style={[styles.badgeText, { color: palette.fg }]}>{label}</Text>
    </View>
  );
}

/* ── Battery indicator ────────────────────────────────── */
export function BatteryIndicator({
  level,
  charging,
}: {
  level: number;
  charging?: boolean;
}) {
  const low = level <= 20;
  const color = low ? colors.critical : colors.foregroundMuted;
  const width = Math.max(10, Math.min(40, level / 100 * 36));
  return (
    <View style={styles.batteryRow}>
      <View style={[styles.batteryOuter, { borderColor: color }]}>
        <View
          style={[
            styles.batteryFill,
            { width, backgroundColor: low ? colors.critical : charging ? colors.warning : colors.primary },
          ]}
        />
      </View>
      <Text style={[styles.batteryText, { color: low ? colors.critical : colors.foregroundMuted }]}>
        %{level}
      </Text>
    </View>
  );
}

/* ── Styles ───────────────────────────────────────────── */
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  btn: {
    minHeight: 46,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    gap: spacing.sm,
  },
  btnPrimary: { backgroundColor: colors.primary },
  btnCritical: { backgroundColor: colors.critical },
  btnOutline: { backgroundColor: "transparent", borderWidth: 1, borderColor: colors.border },
  btnGhost: { backgroundColor: "transparent" },
  btnText: { fontSize: 15, fontWeight: "600" },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  badgeText: { fontSize: 11, fontWeight: "700" },
  batteryRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  batteryOuter: {
    width: 40,
    height: 16,
    borderWidth: 1.5,
    borderRadius: 4,
    borderColor: colors.foregroundMuted,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  batteryFill: { height: 8, borderRadius: 2 },
  batteryText: { fontSize: 12, fontWeight: "600" },
});
