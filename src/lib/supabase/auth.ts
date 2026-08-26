import { supabase } from './client';
import type { User, AuthError } from '@supabase/supabase-js';

export interface AuthResult {
  user: User | null;
  error: AuthError | null;
}

export interface SignUpParams {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

/**
 * Yeni kullanıcı kaydı
 */
export async function signUp({ email, password, fullName, phone }: SignUpParams): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone || '',
      },
    },
  });

  return {
    user: data.user,
    error,
  };
}

/**
 * E-posta ile giriş
 */
export async function signInWithEmail({ email, password }: SignInParams): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return {
    user: data.user,
    error,
  };
}

/**
 * Çıkış yapma
 */
export async function signOut(): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.signOut();
  return { error };
}

/**
 * Mevcut oturum bilgisini getir
 */
export async function getCurrentSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

/**
 * Mevcut kullanıcıyı getir
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Şifre sıfırlama e-postası gönder
 */
export async function resetPassword(email: string): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  return { error };
}

/**
 * Şifre güncelleme
 */
export async function updatePassword(newPassword: string): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  return { error };
}

/**
 * Kullanıcı profil bilgilerini güncelle
 */
export async function updateUserMetadata(metadata: Record<string, unknown>): Promise<{ error: AuthError | null }> {
  const { error } = await supabase.auth.updateUser({
    data: metadata,
  });
  return { error };
}

/**
 * Oturum durumu değişikliğini dinle
 */
export function onAuthStateChange(callback: (event: string, session: unknown) => void) {
  return supabase.auth.onAuthStateChange(callback);
}
