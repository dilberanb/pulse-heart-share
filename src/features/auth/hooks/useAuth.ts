import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase/client";
import type { Database } from "@/types/database";

/* ------------------------------------------------------------------ */
/*  Tipler                                                              */
/* ------------------------------------------------------------------ */

type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

export interface UserProfile {
  id: string;
  phone: string | null;
  fullName: string;
  avatarUrl: string | null;
  createdAt: string;
}

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/* ------------------------------------------------------------------ */
/*  Yardımcı                                                            */
/* ------------------------------------------------------------------ */

function mapProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    phone: row.phone,
    fullName: row.full_name,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
  };
}

/* ------------------------------------------------------------------ */
/*  Oturum state hook'u                                                 */
/* ------------------------------------------------------------------ */

const queryKeys = {
  session: ["auth", "session"] as const,
  profile: ["auth", "profile"] as const,
};

/**
 * Oturum ve kullanıcı profilini yöneten merkezi hook.
 */
export function useAuth(): AuthState & {
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, token: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Record<string, unknown>) => Promise<void>;
} {
  const queryClient = useQueryClient();

  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: queryKeys.session,
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
    staleTime: 4 * 60 * 1000,
  });

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: queryKeys.profile,
    queryFn: async (): Promise<UserProfile | null> => {
      if (!session?.user) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      if (error || !data) return null;
      return mapProfile(data as ProfileRow);
    },
    enabled: !!session?.user,
    staleTime: 60_000,
  });

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      queryClient.invalidateQueries({ queryKey: queryKeys.session });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    });

    return () => subscription.unsubscribe();
  }, [queryClient]);

  const sendOtp = useCallback(async (phone: string) => {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) throw error;
  }, []);

  const verifyOtp = useCallback(
    async (phone: string, token: string) => {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: "sms",
      });
      if (error) throw error;
      if (data.session) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.session });
        return true;
      }
      return false;
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    queryClient.clear();
    toast.success("Başarıyla çıkış yapıldı.");
  }, [queryClient]);

  const updateProfile = useCallback(
    async (updates: Record<string, unknown>) => {
      if (!profile) return;
      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", profile.id);
      if (error) throw error;
      await queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
    [profile, queryClient],
  );

  return {
    user: profile ?? null,
    isLoading: sessionLoading || profileLoading,
    isAuthenticated: !!session?.user,
    sendOtp,
    verifyOtp,
    logout,
    updateProfile,
  };
}

/* ------------------------------------------------------------------ */
/*  Tek kullanımlık mutasyonlar                                         */
/* ------------------------------------------------------------------ */

export function useSendOtp() {
  return useMutation({
    mutationFn: (phone: string) =>
      supabase.auth.signInWithOtp({ phone }).then((r) => {
        if (r.error) throw r.error;
      }),
    onError: () => toast.error("SMS gönderilemedi. Numarayı kontrol et."),
  });
}

export function useVerifyOtp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ phone, token }: { phone: string; token: string }) => {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: "sms",
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.session });
      queryClient.invalidateQueries({ queryKey: queryKeys.profile });
    },
    onError: () => toast.error("Doğrulama başarısız. Kodu kontrol et."),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.clear();
      toast.success("Başarıyla çıkış yapıldı.");
    },
    onError: () => toast.error("Çıkış yapılamadı."),
  });
}
