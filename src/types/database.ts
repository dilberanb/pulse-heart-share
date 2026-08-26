export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Veritabanı şeması türleri
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          date_of_birth: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          date_of_birth?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          date_of_birth?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      statuses: {
        Row: {
          id: string;
          user_id: string;
          status_id: string;
          privacy: 'everyone' | 'friends' | 'close_friends' | 'only_me';
          note: string | null;
          created_at: string;
          expires_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          status_id: string;
          privacy?: 'everyone' | 'friends' | 'close_friends' | 'only_me';
          note?: string | null;
          created_at?: string;
          expires_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          status_id?: string;
          privacy?: 'everyone' | 'friends' | 'close_friends' | 'only_me';
          note?: string | null;
          created_at?: string;
          expires_at?: string | null;
        };
      };
      circles: {
        Row: {
          id: string;
          owner_id: string;
          member_id: string;
          circle_type: 'close_friend' | 'friend' | 'acquaintance' | 'family';
          created_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          member_id: string;
          circle_type: 'close_friend' | 'friend' | 'acquaintance' | 'family';
          created_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          member_id?: string;
          circle_type?: 'close_friend' | 'friend' | 'acquaintance' | 'family';
          created_at?: string;
        };
      };
      reactions: {
        Row: {
          id: string;
          status_id: string;
          user_id: string;
          reaction_kind: 'heart' | 'fire' | 'prayer' | 'hug' | 'wave';
          created_at: string;
        };
        Insert: {
          id?: string;
          status_id: string;
          user_id: string;
          reaction_kind: 'heart' | 'fire' | 'prayer' | 'hug' | 'wave';
          created_at?: string;
        };
        Update: {
          id?: string;
          status_id?: string;
          user_id?: string;
          reaction_kind?: 'heart' | 'fire' | 'prayer' | 'hug' | 'wave';
          created_at?: string;
        };
      };
      nudges: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          created_at?: string;
        };
      };
      emergency_alerts: {
        Row: {
          id: string;
          user_id: string;
          alert_type: string;
          severity: string;
          location: unknown; // GEOGRAPHY(POINT, 4326)
          message: string | null;
          status: 'active' | 'acknowledged' | 'resolved' | 'cancelled';
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          alert_type: string;
          severity: string;
          location?: unknown;
          message?: string | null;
          status?: 'active' | 'acknowledged' | 'resolved' | 'cancelled';
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          alert_type?: string;
          severity?: string;
          location?: unknown;
          message?: string | null;
          status?: 'active' | 'acknowledged' | 'resolved' | 'cancelled';
          created_at?: string;
          resolved_at?: string | null;
        };
      };
      emergency_contacts: {
        Row: {
          id: string;
          user_id: string;
          contact_user_id: string | null;
          contact_phone: string | null;
          notify_order: number;
          is_primary: boolean;
        };
        Insert: {
          id?: string;
          user_id: string;
          contact_user_id?: string | null;
          contact_phone?: string | null;
          notify_order?: number;
          is_primary?: boolean;
        };
        Update: {
          id?: string;
          user_id?: string;
          contact_user_id?: string | null;
          contact_phone?: string | null;
          notify_order?: number;
          is_primary?: boolean;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          body: string | null;
          data: Json;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: string;
          title: string;
          body?: string | null;
          data?: Json;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          body?: string | null;
          data?: Json;
          read?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      cleanup_expired_statuses: {
        Args: Record<string, never>;
        Returns: void;
      };
    };
    Enums: {
      circle_type: 'close_friend' | 'friend' | 'acquaintance' | 'family';
      reaction_kind: 'heart' | 'fire' | 'prayer' | 'hug' | 'wave';
      privacy_level: 'everyone' | 'friends' | 'close_friends' | 'only_me';
      emergency_status: 'active' | 'acknowledged' | 'resolved' | 'cancelled';
    };
  };
}

// Yardımcı türler
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Profil türü (auth ile ilişkili)
export type Profile = Tables<'profiles'>;
export type ProfileInsert = TablesInsert<'profiles'>;
export type ProfileUpdate = TablesUpdate<'statuses'>;

// Durum türü
export type Status = Tables<'statuses'>;
export type StatusInsert = TablesInsert<'statuses'>;
export type StatusUpdate = TablesUpdate<'statuses'>;

// Çevre türü
export type Circle = Tables<'circles'>;
export type CircleInsert = TablesInsert<'circles'>;
export type CircleUpdate = TablesUpdate<'circles'>;

// Tepki türü
export type Reaction = Tables<'reactions'>;
export type ReactionInsert = TablesInsert<'reactions'>;
export type ReactionUpdate = TablesUpdate<'reactions'>;

// Nudge türü
export type Nudge = Tables<'nudges'>;
export type NudgeInsert = TablesInsert<'nudges'>;
export type NudgeUpdate = TablesUpdate<'nudges'>;

// Acil durum uyarısı türü
export type EmergencyAlert = Tables<'emergency_alerts'>;
export type EmergencyAlertInsert = TablesInsert<'emergency_alerts'>;
export type EmergencyAlertUpdate = TablesUpdate<'emergency_alerts'>;

// Acil durum kişisi türü
export type EmergencyContact = Tables<'emergency_contacts'>;
export type EmergencyContactInsert = TablesInsert<'emergency_contacts'>;
export type EmergencyContactUpdate = TablesUpdate<'emergency_contacts'>;

// Bildirim türü
export type Notification = Tables<'notifications'>;
export type NotificationInsert = TablesInsert<'notifications'>;
export type NotificationUpdate = TablesUpdate<'notifications'>;

// Enum türleri
export type CircleType = Enums<'circle_type'>;
export type ReactionKind = Enums<'reaction_kind'>;
export type PrivacyLevel = Enums<'privacy_level'>;
export type EmergencyStatus = Enums<'emergency_status'>;
