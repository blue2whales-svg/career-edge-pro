export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      application_messages: {
        Row: {
          application_id: string
          body: string
          created_at: string | null
          id: string
          read: boolean | null
          sender_id: string
        }
        Insert: {
          application_id: string
          body: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          sender_id: string
        }
        Update: {
          application_id?: string
          body?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "application_messages_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          applied_at: string | null
          candidate_id: string
          cover_note: string | null
          id: string
          job_id: string
          status: string | null
        }
        Insert: {
          applied_at?: string | null
          candidate_id: string
          cover_note?: string | null
          id?: string
          job_id: string
          status?: string | null
        }
        Update: {
          applied_at?: string | null
          candidate_id?: string
          cover_note?: string | null
          id?: string
          job_id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_postings"
            referencedColumns: ["id"]
          },
        ]
      }
      cached_jobs: {
        Row: {
          apply_url: string | null
          category: string | null
          company: string
          country: string | null
          created_at: string
          description: string | null
          discovered_at: string
          external_id: string | null
          featured: boolean | null
          hot: boolean | null
          hot_score: number | null
          id: string
          industry: string | null
          is_active: boolean
          is_premium: boolean
          location: string
          market: string | null
          posted: string | null
          posted_at: string | null
          requirements: string[] | null
          salary: string | null
          source: string
          source_label: string | null
          tag: string | null
          title: string
          type: string | null
          updated_at: string
          verified: boolean | null
          visa_sponsorship: boolean | null
        }
        Insert: {
          apply_url?: string | null
          category?: string | null
          company: string
          country?: string | null
          created_at?: string
          description?: string | null
          discovered_at?: string
          external_id?: string | null
          featured?: boolean | null
          hot?: boolean | null
          hot_score?: number | null
          id?: string
          industry?: string | null
          is_active?: boolean
          is_premium?: boolean
          location: string
          market?: string | null
          posted?: string | null
          posted_at?: string | null
          requirements?: string[] | null
          salary?: string | null
          source?: string
          source_label?: string | null
          tag?: string | null
          title: string
          type?: string | null
          updated_at?: string
          verified?: boolean | null
          visa_sponsorship?: boolean | null
        }
        Update: {
          apply_url?: string | null
          category?: string | null
          company?: string
          country?: string | null
          created_at?: string
          description?: string | null
          discovered_at?: string
          external_id?: string | null
          featured?: boolean | null
          hot?: boolean | null
          hot_score?: number | null
          id?: string
          industry?: string | null
          is_active?: boolean
          is_premium?: boolean
          location?: string
          market?: string | null
          posted?: string | null
          posted_at?: string | null
          requirements?: string[] | null
          salary?: string | null
          source?: string
          source_label?: string | null
          tag?: string | null
          title?: string
          type?: string | null
          updated_at?: string
          verified?: boolean | null
          visa_sponsorship?: boolean | null
        }
        Relationships: []
      }
      candidate_profiles: {
        Row: {
          created_at: string | null
          cv_url: string | null
          full_name: string | null
          headline: string | null
          id: string
          location: string | null
          phone: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          cv_url?: string | null
          full_name?: string | null
          headline?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          cv_url?: string | null
          full_name?: string | null
          headline?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          user_id?: string
        }
        Relationships: []
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      employer_profiles: {
        Row: {
          company_name: string | null
          created_at: string | null
          id: string
          plan_expires_at: string | null
          plan_pkg: string | null
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string | null
          id?: string
          plan_expires_at?: string | null
          plan_pkg?: string | null
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string | null
          id?: string
          plan_expires_at?: string | null
          plan_pkg?: string | null
          user_id?: string
        }
        Relationships: []
      }
      generated_documents: {
        Row: {
          content: string
          created_at: string
          id: string
          order_id: string
          service_type: string
          status: string
          updated_at: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          order_id: string
          service_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          order_id?: string
          service_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "generated_documents_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          application_id: string
          created_at: string | null
          id: string
          meeting_link: string | null
          notes: string | null
          scheduled_at: string | null
        }
        Insert: {
          application_id: string
          created_at?: string | null
          id?: string
          meeting_link?: string | null
          notes?: string | null
          scheduled_at?: string | null
        }
        Update: {
          application_id?: string
          created_at?: string | null
          id?: string
          meeting_link?: string | null
          notes?: string | null
          scheduled_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "interviews_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      job_postings: {
        Row: {
          company: string
          created_at: string | null
          description: string | null
          employer_id: string
          expires_at: string | null
          id: string
          industry: string | null
          job_type: string | null
          location: string | null
          plan_pkg: string | null
          salary: string | null
          status: string | null
          title: string
        }
        Insert: {
          company: string
          created_at?: string | null
          description?: string | null
          employer_id: string
          expires_at?: string | null
          id?: string
          industry?: string | null
          job_type?: string | null
          location?: string | null
          plan_pkg?: string | null
          salary?: string | null
          status?: string | null
          title: string
        }
        Update: {
          company?: string
          created_at?: string | null
          description?: string | null
          employer_id?: string
          expires_at?: string | null
          id?: string
          industry?: string | null
          job_type?: string | null
          location?: string | null
          plan_pkg?: string | null
          salary?: string | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      job_unlocks: {
        Row: {
          amount_paid: number
          created_at: string
          currency: string
          id: string
          job_id: string
          unlock_type: string
          user_id: string
        }
        Insert: {
          amount_paid?: number
          created_at?: string
          currency?: string
          id?: string
          job_id: string
          unlock_type?: string
          user_id: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          currency?: string
          id?: string
          job_id?: string
          unlock_type?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          order_id: string
          sender_type: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          order_id: string
          sender_type?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          order_id?: string
          sender_type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          details: string | null
          education: string | null
          email: string
          experience: string | null
          id: string
          job_title: string | null
          mpesa_checkout_request_id: string | null
          mpesa_receipt: string | null
          name: string
          phone: string | null
          services: string[]
          skills: string | null
          status: string
          total_amount: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          details?: string | null
          education?: string | null
          email: string
          experience?: string | null
          id?: string
          job_title?: string | null
          mpesa_checkout_request_id?: string | null
          mpesa_receipt?: string | null
          name: string
          phone?: string | null
          services: string[]
          skills?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          details?: string | null
          education?: string | null
          email?: string
          experience?: string | null
          id?: string
          job_title?: string | null
          mpesa_checkout_request_id?: string | null
          mpesa_receipt?: string | null
          name?: string
          phone?: string | null
          services?: string[]
          skills?: string | null
          status?: string
          total_amount?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      owner_applications: {
        Row: {
          apply_url: string | null
          company: string
          cover_letter: string | null
          created_at: string
          cv_version: string | null
          follow_up_date: string | null
          id: string
          job_title: string
          status: string
          user_id: string
        }
        Insert: {
          apply_url?: string | null
          company: string
          cover_letter?: string | null
          created_at?: string
          cv_version?: string | null
          follow_up_date?: string | null
          id?: string
          job_title: string
          status?: string
          user_id: string
        }
        Update: {
          apply_url?: string | null
          company?: string
          cover_letter?: string | null
          created_at?: string
          cv_version?: string | null
          follow_up_date?: string | null
          id?: string
          job_title?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          free_unlocks_used: number
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          free_unlocks_used?: number
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          free_unlocks_used?: number
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string
          credit_amount: number
          id: string
          referred_email: string
          referrer_id: string
          status: string
        }
        Insert: {
          created_at?: string
          credit_amount?: number
          id?: string
          referred_email: string
          referrer_id: string
          status?: string
        }
        Update: {
          created_at?: string
          credit_amount?: number
          id?: string
          referred_email?: string
          referrer_id?: string
          status?: string
        }
        Relationships: []
      }
      revision_requests: {
        Row: {
          created_at: string
          description: string
          id: string
          order_id: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          order_id: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          order_id?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "revision_requests_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number
          billing_cycle: string
          currency: string
          expires_at: string
          id: string
          plan: string
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          amount?: number
          billing_cycle?: string
          currency?: string
          expires_at?: string
          id?: string
          plan?: string
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          billing_cycle?: string
          currency?: string
          expires_at?: string
          id?: string
          plan?: string
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      vault_profiles: {
        Row: {
          career_summary: string
          certifications: string
          created_at: string
          education: Json
          email: string
          full_name: string
          id: string
          languages: string
          linkedin: string
          location: string
          phone: string
          portfolio: string
          roles: Json
          soft_skills: string
          target_roles: string
          technical_skills: string
          updated_at: string
          user_id: string
        }
        Insert: {
          career_summary?: string
          certifications?: string
          created_at?: string
          education?: Json
          email?: string
          full_name?: string
          id?: string
          languages?: string
          linkedin?: string
          location?: string
          phone?: string
          portfolio?: string
          roles?: Json
          soft_skills?: string
          target_roles?: string
          technical_skills?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          career_summary?: string
          certifications?: string
          created_at?: string
          education?: Json
          email?: string
          full_name?: string
          id?: string
          languages?: string
          linkedin?: string
          location?: string
          phone?: string
          portfolio?: string
          roles?: Json
          soft_skills?: string
          target_roles?: string
          technical_skills?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      verified_employers: {
        Row: {
          created_at: string
          employer_name: string
          id: string
          logo_url: string | null
          tier: string
          verified: boolean
        }
        Insert: {
          created_at?: string
          employer_name: string
          id?: string
          logo_url?: string | null
          tier?: string
          verified?: boolean
        }
        Update: {
          created_at?: string
          employer_name?: string
          id?: string
          logo_url?: string | null
          tier?: string
          verified?: boolean
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      get_jobs_page_data: { Args: never; Returns: Json }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
