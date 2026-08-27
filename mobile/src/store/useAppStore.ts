import { create } from "zustand";

interface AppState {
  /** Bildirim tercihi — çubuk veya tam ekran */
  notificationPreference: "bar" | "fullscreen";
  setNotificationPreference: (p: "bar" | "fullscreen") => void;
  /** Yaşlı modu */
  seniorMode: boolean;
  setSeniorMode: (v: boolean) => void;
  /** Aktif QuickCheck bildirimi */
  currentQuickCheck: import("@/types").QuickCheck | null;
  setCurrentQuickCheck: (q: import("@/types").QuickCheck | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  notificationPreference: "bar",
  setNotificationPreference: (p) => set({ notificationPreference: p }),
  seniorMode: false,
  setSeniorMode: (v) => set({ seniorMode: v }),
  currentQuickCheck: null,
  setCurrentQuickCheck: (q) => set({ currentQuickCheck: q }),
}));
