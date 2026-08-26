import { useEffect, useRef, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase/client";
import { statusKeys } from "@/features/status/hooks/useStatusFeed";
import { notificationKeys } from "@/features/notifications/hooks/useNotifications";

/* ------------------------------------------------------------------ */
/*  Channel yönetimi                                                    */
/* ------------------------------------------------------------------ */

type ChannelName = "status-feed" | "emergency" | "presence" | "notifications";

const activeChannels = new Map<string, ReturnType<typeof supabase.channel>>();

/**
 * Supabase Realtime channel'ı başlat veya mevcut olanı döndür.
 * Aynı isimde birden fazla channel açılmasını önler.
 */
function getOrCreateChannel(name: ChannelName) {
  if (activeChannels.has(name)) return activeChannels.get(name)!;

  const channel = supabase.channel(name);
  activeChannels.set(name, channel);
  return channel;
}

/**
 * Channel aboneliğini temizle.
 */
function removeChannel(name: ChannelName) {
  const channel = activeChannels.get(name);
  if (channel) {
    supabase.removeChannel(channel);
    activeChannels.delete(name);
  }
}

/* ------------------------------------------------------------------ */
/*  Status feed Realtime                                                */
/* ------------------------------------------------------------------ */

/**
 * Durum akışını dinle.
 * Yeni durum eklendiğinde veya değiştirildiğinde React Query cache'ini günceller.
 */
export function useStatusFeedRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = getOrCreateChannel("status-feed");

    channel
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "statuses",
        },
        (payload) => {
          // Tüm feed sorgularını tazele
          queryClient.invalidateQueries({
            queryKey: ["status", "feed"],
          });

          // Yeni durum eklendiyse mine sorgusunu da tazele
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            queryClient.invalidateQueries({
              queryKey: statusKeys.mine,
            });
          }
        },
      )
      .subscribe();

    return () => {
      removeChannel("status-feed");
    };
  }, [queryClient]);
}

/* ------------------------------------------------------------------ */
/*  Acil durum broadcast                                                */
/* ------------------------------------------------------------------ */

export interface EmergencyAlert {
  id: string;
  userId: string;
  userName: string;
  message: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

type EmergencyCallback = (alert: EmergencyAlert) => void;

/**
 * Acil durum bildirimlerini dinle.
 * Broadcast channel üzerinden anlık SOS uyarıları alır.
 */
export function useEmergencyRealtime(onAlert?: EmergencyCallback) {
  const callbackRef = useRef(onAlert);
  callbackRef.current = onAlert;

  useEffect(() => {
    const channel = getOrCreateChannel("emergency");

    channel
      .on("broadcast", { event: "emergency_alert" }, ({ payload }) => {
        const alert = payload as EmergencyAlert;
        callbackRef.current?.(alert);
      })
      .subscribe();

    return () => {
      removeChannel("emergency");
    };
  }, []);
}

/**
 * Acil durum broadcast'i gönder (SOS nhưngonuna basıldığında).
 */
export async function broadcastEmergency(alert: EmergencyAlert) {
  const channel = getOrCreateChannel("emergency");

  await channel.send({
    type: "broadcast",
    event: "emergency_alert",
    payload: alert,
  });
}

/* ------------------------------------------------------------------ */
/*  Presence tracking                                                   */
/* ------------------------------------------------------------------ */

export interface PresenceState {
  userId: string;
  userName: string;
  status: "online" | "away" | "offline";
  lastSeen: string;
}

/**
 * Çevrimiçi kullanıcı varlığını izle.
 * Tüm aktif kullanıcıların online durumunu takip eder.
 */
export function usePresenceTracking(currentUserId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!currentUserId) return;

    const channel = getOrCreateChannel("presence");

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState<PresenceState>();
        // Presence state güncellendiğinde ilgili sorguları tazele
        queryClient.invalidateQueries({ queryKey: ["presence"] });
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        // Yeni kullanıcı katıldı
        console.debug("[Presence] Joined:", key, newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        // Kullanıcı ayrıldı
        console.debug("[Presence] Left:", key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            userId: currentUserId,
            userName: "",
            status: "online",
            lastSeen: new Date().toISOString(),
          } satisfies PresenceState);
        }
      });

    return () => {
      removeChannel("presence");
    };
  }, [currentUserId, queryClient]);
}

/**
 * Belirli bir kullanıcının online durumunu kontrol et.
 */
export function getOnlineUsers(): PresenceState[] {
  const channel = activeChannels.get("presence");
  if (!channel) return [];

  const state = channel.presenceState<PresenceState>();
  return Object.values(state).flat();
}

/* ------------------------------------------------------------------ */
/*  Bildirim Realtime                                                   */
/* ------------------------------------------------------------------ */

/**
 * Yeni bildirimleri Realtime olarak dinle.
 * Bildirim geldiğinde React Query cache'ini günceller.
 */
export function useNotificationsRealtime(userId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel(`notifications-${userId}`);

    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({
            queryKey: notificationKeys.all,
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
}

/* ------------------------------------------------------------------ */
/*  Genel temizleme                                                     */
/* ------------------------------------------------------------------ */

/**
 * Tüm Realtime aboneliklerini sonlandır.
 * Uygulama kapatılırken veya çıkış yapıl çağrılır.
 */
export function unsubscribeAll() {
  for (const [name] of activeChannels) {
    removeChannel(name as ChannelName);
  }
}

/**
 * Aktif channel sayısını döndür (debug amaçlı).
 */
export function getActiveChannelCount(): number {
  return activeChannels.size;
}
