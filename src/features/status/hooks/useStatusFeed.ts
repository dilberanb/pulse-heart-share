import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  fetchFeed,
  fetchMyStatus,
  nudgePerson,
  publishStatus,
  toggleReaction,
} from "@/features/status/api/mockApi";
import { useAppStore } from "@/store/useAppStore";
import type { PublishStatusInput, ReactionKind, StatusEntry } from "@/types/status";

/**
 * Sunucu state'i için tek giriş noktası.
 * Realtime'a geçişte: aşağıdaki queryKey'lere Supabase channel
 * event'lerinde `queryClient.setQueryData(...)` uygulanır — bileşenler değişmez.
 */

export const statusKeys = {
  feed: (circle: string, onlyActive: boolean) => ["status", "feed", circle, onlyActive] as const,
  mine: ["status", "mine"] as const,
};

/** Aktif filtrelerle canlı feed. */
export function useStatusFeed() {
  const circle = useAppStore((s) => s.circle);
  const onlyActive = useAppStore((s) => s.onlyActive);

  return useQuery({
    queryKey: statusKeys.feed(circle, onlyActive),
    queryFn: () => fetchFeed({ circle, onlyActive }),
    // Realtime bağlanana kadar makul bir tazelik penceresi.
    staleTime: 30_000,
  });
}

/** Mevcut kullanıcının son durumu. */
export function useMyStatus() {
  return useQuery({ queryKey: statusKeys.mine, queryFn: fetchMyStatus, staleTime: 30_000 });
}

/** Yeni durum yayınlama. */
export function usePublishStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: PublishStatusInput) => publishStatus(input),
    onSuccess: (created) => {
      queryClient.setQueryData(statusKeys.mine, created);
      queryClient.invalidateQueries({ queryKey: ["status", "feed"] });
      toast.success(`Durumun güncellendi: ${created.status.emoji} ${created.status.label}`);
    },
    onError: () => toast.error("Durum güncellenemedi, tekrar dener misin?"),
  });
}

/** Tek dokunuş empati tepkisi (optimistic). */
export function useToggleReaction() {
  const queryClient = useQueryClient();
  const circle = useAppStore((s) => s.circle);
  const onlyActive = useAppStore((s) => s.onlyActive);
  const key = statusKeys.feed(circle, onlyActive);

  return useMutation({
    mutationFn: ({ entryId, kind }: { entryId: string; kind: ReactionKind }) =>
      toggleReaction(entryId, kind),
    // Empati anlık hissettirmeli: önce UI, sonra sunucu.
    onMutate: async ({ entryId, kind }) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<StatusEntry[]>(key);

      queryClient.setQueryData<StatusEntry[]>(key, (entries) =>
        entries?.map((e) => {
          if (e.id !== entryId) return e;
          const has = e.myReactions.includes(kind);
          return {
            ...e,
            reactions: {
              ...e.reactions,
              [kind]: Math.max(0, e.reactions[kind] + (has ? -1 : 1)),
            },
            myReactions: has ? e.myReactions.filter((k) => k !== kind) : [...e.myReactions, kind],
          };
        }),
      );

      return { previous };
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
      toast.error("Tepki gönderilemedi.");
    },
  });
}

/** "Nabız yokla" — güncelleme isteği gönder. */
export function useNudge() {
  return useMutation({
    mutationFn: (personId: string) => nudgePerson(personId),
    onSuccess: () => toast.success("Nazik bir hatırlatma gönderildi 💛"),
  });
}
