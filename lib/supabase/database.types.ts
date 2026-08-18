export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "user" | "admin" | "moderator";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          is_premium: boolean;
          premium_expires_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          is_premium?: boolean;
          premium_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          is_premium?: boolean;
          premium_expires_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_tool_favorites: {
        Row: {
          id: string;
          user_id: string;
          tool_slug: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          tool_slug: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          tool_slug?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      tool_usage: {
        Row: {
          id: string;
          user_id: string | null;
          tool_slug: string;
          usage_count: number;
          last_used_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          tool_slug: string;
          usage_count?: number;
          last_used_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          tool_slug?: string;
          usage_count?: number;
          last_used_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      tool_feedback: {
        Row: {
          id: string;
          user_id: string | null;
          tool_slug: string;
          rating: number;
          feedback: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          tool_slug: string;
          rating: number;
          feedback?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          tool_slug?: string;
          rating?: number;
          feedback?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      admin_settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          key: string;
          value: Json;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          key?: string;
          value?: Json;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          admin_id: string | null;
          action: string;
          target_type: string | null;
          target_id: string | null;
          metadata: Json;
          details: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          admin_id?: string | null;
          action: string;
          target_type?: string | null;
          target_id?: string | null;
          metadata?: Json;
          details?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          admin_id?: string | null;
          action?: string;
          target_type?: string | null;
          target_id?: string | null;
          metadata?: Json;
          details?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      feature_flags: {
        Row: {
          key: string;
          enabled: boolean;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          key: string;
          enabled?: boolean;
          description?: string | null;
          updated_at?: string;
        };
        Update: {
          key?: string;
          enabled?: boolean;
          description?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      admin_audit_logs: {
        Row: {
          id: string;
          admin_id: string;
          action: string;
          target_type: string;
          target_id: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          admin_id: string;
          action: string;
          target_type: string;
          target_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          admin_id?: string;
          action?: string;
          target_type?: string;
          target_id?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      user_presence: {
        Row: {
          user_id: string;
          last_seen_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          last_seen_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          last_seen_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan: string;
          status: string;
          provider: string | null;
          provider_subscription_id: string | null;
          provider_customer_id: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan?: string;
          status?: string;
          provider?: string | null;
          provider_subscription_id?: string | null;
          provider_customer_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          plan?: string;
          status?: string;
          provider?: string | null;
          provider_subscription_id?: string | null;
          provider_customer_id?: string | null;
          current_period_start?: string | null;
          current_period_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      get_admin_metrics: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Enums: {
      user_role: UserRole;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
