import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

/* ------------------------------------------------------------------ */
/*  Tipler                                                              */
/* ------------------------------------------------------------------ */

type CircleInsert = Database["public"]["Tables"]["circles"]["Insert"];
type CircleUpdate = Database["public"]["Tables"]["circles"]["Update"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export type CircleType = Database["public"]["Enums"]["circle_type"];

export interface CircleMember {
  userId: string;
  fullName: string;
  phone: string | null;
  avatarUrl: string | null;
  circleType: CircleType;
}

/* ------------------------------------------------------------------ */
/*  Query keys                                                          */
/* ------------------------------------------------------------------ */

export const circleKeys = {
  all: ["circles"] as const,
};

/* ------------------------------------------------------------------ */
/*  Hook'lar                                                            */
/* ------------------------------------------------------------------ */

/**
 * Kullanıcının oluşturduğu tüm çevre ilişkilerini getirir.
 * Kişi profilleri ayrı sorgu ile çekilir.
 */
export function useCircles() {
  return useQuery({
    queryKey: circleKeys.all,
    queryFn: async (): Promise<CircleMember[]> => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("Oturum bulunamadı");

      const userId = sessionData.session.user.id;

      const { data: circleRows, error: circleError } = await supabase
        .from("circles")
        .select("id, owner_id, member_id, circle_type, created_at")
        .eq("owner_id", userId);

      if (circleError) throw circleError;

      const rows = (circleRows ?? []) as {
        id: string;
        owner_id: string;
        member_id: string;
        circle_type: CircleType;
        created_at: string;
      }[];

      if (rows.length === 0) return [];

      const memberIds = [...new Set(rows.map((r) => r.member_id))];

      const { data: profileRows, error: profileError } = await supabase
        .from("profiles")
        .select("id, full_name, phone, avatar_url")
        .in("id", memberIds);

      if (profileError) throw profileError;

      const profiles = new Map<string, Pick<ProfileRow, "id" | "full_name" | "phone" | "avatar_url">>();
      for (const p of (profileRows ?? []) as Pick<ProfileRow, "id" | "full_name" | "phone" | "avatar_url">[]) {
        profiles.set(p.id, p);
      }

      return rows.map((row) => {
        const profile = profiles.get(row.member_id);
        return {
          userId: row.member_id,
          fullName: profile?.full_name ?? "",
          phone: profile?.phone ?? null,
          avatarUrl: profile?.avatar_url ?? null,
          circleType: row.circle_type,
        };
      });
    },
    staleTime: 30_000,
  });
}

/** Belirli bir çember türündeki üyeleri getirir. */
export function useCircleByType(circleType: CircleType) {
  const { data: allMembers } = useCircles();
  return (allMembers ?? []).filter((m) => m.circleType === circleType);
}

/** Kişiye bir çember türü ata. */
export function useAddToCircle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { memberId: string; circleType: CircleType }) => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("Oturum bulunamadı");

      const userId = sessionData.session.user.id;

      const { data: existingRows } = await supabase
        .from("circles")
        .select("id")
        .eq("owner_id", userId)
        .eq("member_id", input.memberId);

      const existing = (existingRows as { id: string }[] | null)?.[0];

      if (existing) {
        const updates: CircleUpdate = { circle_type: input.circleType };
        const { error } = await supabase
          .from("circles")
          .update(updates)
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const insert: CircleInsert = {
          owner_id: userId,
          member_id: input.memberId,
          circle_type: input.circleType,
        };
        const { error } = await supabase.from("circles").insert(insert);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: circleKeys.all });
      toast.success("Çember güncellendi.");
    },
    onError: () => toast.error("Çember güncellenemedi."),
  });
}

/** Bir çemberden kişi çıkar. */
export function useRemoveFromCircle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memberId: string) => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("Oturum bulunamadı");

      const { error } = await supabase
        .from("circles")
        .delete()
        .eq("owner_id", sessionData.session.user.id)
        .eq("member_id", memberId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: circleKeys.all });
      toast.success("Kişi çemberden çıkarıldı.");
    },
    onError: () => toast.error("Çıkarma başarısız."),
  });
}

/** Telefona göre kullanıcıyı bul ve çemberine ekle. */
export function useAddToCircleByPhone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { phone: string; circleType: CircleType }) => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) throw new Error("Oturum bulunamadı");

      const userId = sessionData.session.user.id;

      const { data: profileRows, error: profileError } = await supabase
        .from("profiles")
        .select("id")
        .eq("phone", input.phone);

      if (profileError) throw profileError;

      const profiles = (profileRows ?? []) as Pick<ProfileRow, "id">[];
      if (profiles.length === 0) {
        throw new Error("Bu telefon numarasıyla kayıtlı kullanıcı bulunamadı.");
      }

      const targetUserId = profiles[0]!.id;
      if (targetUserId === userId) {
        throw new Error("Kendini çemberine ekleyemezsin.");
      }

      const { data: existingRows } = await supabase
        .from("circles")
        .select("id")
        .eq("owner_id", userId)
        .eq("member_id", targetUserId);

      const existing = (existingRows as { id: string }[] | null)?.[0];

      if (existing) {
        const updates: CircleUpdate = { circle_type: input.circleType };
        const { error } = await supabase
          .from("circles")
          .update(updates)
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const insert: CircleInsert = {
          owner_id: userId,
          member_id: targetUserId,
          circle_type: input.circleType,
        };
        const { error } = await supabase.from("circles").insert(insert);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: circleKeys.all });
      toast.success("Kişi çembere eklendi.");
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Kişi eklenemedi.");
      }
    },
  });
}
