import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

/* ------------------------------------------------------------------ */
/*  Tipler                                                              */
/* ------------------------------------------------------------------ */

type NotificationUpdate = Database["public"]["Tables"]["notifications"]["Update"];
type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];

export type NotificationType =
  | "status"
  | "reaction"
  | "nudge"
  | "emergency"
  | "circle_invite";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationSummary {
  total: number;
  unread: number;
}

/* ------------------------------------------------------------------ */
/*  Query keys                                                          */
/* ------------------------------------------------------------------ */

export const notificationKeys = {
  all: ["notifications"] as const,
  list: ["notifications", "list"] as const,
  summary: ["notifications", "summary"] as const,
};

/* ------------------------------------------------------------------ */
/*  Yardımcı                                                            */
/* ------------------------------------------------------------------ */

function mapNotification(row: NotificationRow): Notification {
  const data =
    typeof row.data === "object" && row.data !== null
      ? (row.data as Record<string, unknown>)
      : {};
  return {
    id: row.id,
    type: row.type as NotificationType,
    title: row.title,
    body: row.body ?? "",
    data,
    isRead: row.read as boolean,
    createdAt: row.created_at,
  };
}

/* ------------------------------------------------------------------ */
/*  Hook'lar                                                            */
/* ------------------------------------------------------------------ */

/** Bildirim listesini getirir. */
export function useNotifications() {
  return useQuery({
    queryKey: notificationKeys.list,
    queryFn: async (): Promise<Notification[]> => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("Oturum bulunamadı");

      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", sessionData.session.user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      return (data ?? []).map(mapNotification);
    },
    staleTime: 15_000,
  });
}

/** Okunmamış bildirim sayısını getirir. */
export function useNotificationSummary() {
  return useQuery({
    queryKey: notificationKeys.summary,
    queryFn: async (): Promise<NotificationSummary> => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) return { total: 0, unread: 0 };

      const { count: total } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", sessionData.session.user.id);

      const { count: unread } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", sessionData.session.user.id)
        .eq("read", false);

      return {
        total: total ?? 0,
        unread: unread ?? 0,
      };
    },
    staleTime: 15_000,
  });
}

/** Tek bildirimi okundu olarak işaretle. */
export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (notificationId: string) => {
      const update: NotificationUpdate = { read: true };
      const { error } = await supabase
        .from("notifications")
        .update(update)
        .eq("id", notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/** Tüm bildirimleri okundu olarak işaretle. */
export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("Oturum bulunamadı");

      const update: NotificationUpdate = { read: true };
      const { error } = await supabase
        .from("notifications")
        .update(update)
        .eq("user_id", sessionData.session.user.id)
        .eq("read", false);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast.success("Tüm bildirimler okundu.");
    },
    onError: () => toast.error("İşlem başarısız."),
  });
}

/** Bildirim türü için ikon ve renk bilgisi. */
export const NOTIFICATION_META: Record<
  NotificationType,
  { label: string; emoji: string; colorClass: string }
> = {
  status: {
    label: "Durum güncellendi",
    emoji: "💓",
    colorClass: "text-mood-calm-ink",
  },
  reaction: {
    label: "Empati tepkisi",
    emoji: "🤗",
    colorClass: "text-mood-joy-ink",
  },
  nudge: {
    label: "Nazik hatırlatma",
    emoji: "👋",
    colorClass: "text-mood-low-ink",
  },
  emergency: {
    label: "Acil durum",
    emoji: "🚨",
    colorClass: "text-mood-urgent-ink",
  },
  circle_invite: {
    label: "Çember daveti",
    emoji: "⭕",
    colorClass: "text-mood-need-ink",
  },
};
