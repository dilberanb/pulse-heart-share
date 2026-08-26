import { create } from "zustand";

import type { PrivacyCircle } from "@/types/status";
import type { QuickCheck } from "@/types/quickcheck";

/**
 * Global istemci state'i (Zustand).
 * Sunucu verisi burada TUTULMAZ — o React Query'nin sorumluluğunda.
 * Burada yalnızca oturum, tercih ve UI durumu yaşar.
 */
interface AppState {
  /** Aktif feed çemberi filtresi. */
  circle: PrivacyCircle;
  /** Sadece 24 saat içindeki (aktif) durumlar. */
  onlyActive: boolean;
  /** Durum güncelleme sayfası/paneli için varsayılan gizlilik seçimi. */
  defaultPrivacy: PrivacyCircle;
  /** Durum güncelleme panelinin açık olup olmadığı. */
  isComposerOpen: boolean;
  /** SOS panelinin açık olup olmadığı. */
  isSosOpen: boolean;
  /** Acil durum panelinin açık olup olmadığı. */
  isEmergencyOpen: boolean;
  /** Bildirim gösterim tercihi. */
  notificationPreference: "bar" | "fullscreen";
  /** Büyük mod (yaşlı modu). */
  seniorMode: boolean;
  /** Aktif QuickCheck. */
  currentQuickCheck: QuickCheck | null;

  setCircle: (circle: PrivacyCircle) => void;
  setOnlyActive: (onlyActive: boolean) => void;
  setDefaultPrivacy: (privacy: PrivacyCircle) => void;
  openComposer: () => void;
  closeComposer: () => void;
  openSos: () => void;
  closeSos: () => void;
  openEmergency: () => void;
  closeEmergency: () => void;
  setNotificationPreference: (preference: "bar" | "fullscreen") => void;
  setSeniorMode: (enabled: boolean) => void;
  setCurrentQuickCheck: (check: QuickCheck | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  circle: "everyone",
  onlyActive: true,
  defaultPrivacy: "close",
  isComposerOpen: false,
  isSosOpen: false,
  isEmergencyOpen: false,
  notificationPreference: "bar",
  seniorMode: false,
  currentQuickCheck: null,

  setCircle: (circle) => set({ circle }),
  setOnlyActive: (onlyActive) => set({ onlyActive }),
  setDefaultPrivacy: (defaultPrivacy) => set({ defaultPrivacy }),
  openComposer: () => set({ isComposerOpen: true }),
  closeComposer: () => set({ isComposerOpen: false }),
  openSos: () => set({ isSosOpen: true }),
  closeSos: () => set({ isSosOpen: false }),
  openEmergency: () => set({ isEmergencyOpen: true }),
  closeEmergency: () => set({ isEmergencyOpen: false }),
  setNotificationPreference: (notificationPreference) => set({ notificationPreference }),
  setSeniorMode: (seniorMode) => set({ seniorMode }),
  setCurrentQuickCheck: (currentQuickCheck) => set({ currentQuickCheck }),
}));

/** Gizlilik çemberi etiketleri — UI genelinde tek kaynak. */
export const CIRCLE_LABELS: Record<PrivacyCircle, string> = {
  everyone: "Herkes",
  close: "Yakın Arkadaşlar",
  inner: "Çekirdek (Aile)",
};
