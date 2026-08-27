/**
 * Nabız mobil tema — web'deki dark slate paletiyle birebir uyumlu.
 * - Arka plan: slate-800 (#1e293b)
 * - Kart: slate-700/800 (#273548)
 * - Yeşil (güvenli): #22c55e
 * - Amber (uyarı): #eab308
 * - Kırmızı (kritik): #ef4444
 */
export const colors = {
  background: "#1e293b",
  surface: "#273548",
  surfaceAlt: "#334155",
  border: "#334155",
  borderSoft: "rgba(51, 65, 85, 0.5)",

  foreground: "#f1f5f9",
  foregroundMuted: "#94a3b8",
  foregroundDim: "#64748b",

  primary: "#22c55e",
  primaryForeground: "#1e293b",
  primarySoft: "rgba(34, 197, 94, 0.12)",

  safe: "#22c55e",
  safeSoft: "rgba(34, 197, 94, 0.12)",
  warning: "#eab308",
  warningSoft: "rgba(234, 179, 8, 0.12)",
  critical: "#ef4444",
  criticalSoft: "rgba(239, 68, 68, 0.12)",

  sos: "#ef4444",
  sosSurface: "#450a0a",
  sosInk: "#ffffff",

  white: "#ffffff",
  black: "#000000",
} as const;

export type ThemeColors = typeof colors;

/** Erişilebilirlik rozeti renkleri */
export const badgeColors: Record<string, { bg: string; fg: string }> = {
  green: { bg: "rgba(34, 197, 94, 0.14)", fg: "#4ade80" },
  amber: { bg: "rgba(234, 179, 8, 0.14)", fg: "#facc15" },
  red: { bg: "rgba(239, 68, 68, 0.14)", fg: "#f87171" },
  blue: { bg: "rgba(59, 130, 246, 0.14)", fg: "#60a5fa" },
};

export const typography = {
  title: 22,
  heading: 18,
  body: 15,
  small: 13,
  micro: 11,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;
