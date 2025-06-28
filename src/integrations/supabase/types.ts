export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      branches: {
        Row: {
          active_tables: number
          closes_at: string | null
          company_id: number
          created_at: string
          id: number
          images: string[] | null
          location: string | null
          name: string
          opens_at: string | null
          status: string | null
          total_tables: number
          updated_at: string
        }
        Insert: {
          active_tables?: number
          closes_at?: string | null
          company_id: number
          created_at?: string
          id?: number
          images?: string[] | null
          location?: string | null
          name: string
          opens_at?: string | null
          status?: string | null
          total_tables?: number
          updated_at?: string
        }
        Update: {
          active_tables?: number
          closes_at?: string | null
          company_id?: number
          created_at?: string
          id?: number
          images?: string[] | null
          location?: string | null
          name?: string
          opens_at?: string | null
          status?: string | null
          total_tables?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "branches_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          created_at: string
          email: string
          id: number
          name: string
          owner_id: string
          phone_number: string
          plan: string | null
          size_range: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          name: string
          owner_id: string
          phone_number: string
          plan?: string | null
          size_range?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          name?: string
          owner_id?: string
          phone_number?: string
          plan?: string | null
          size_range?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "companies_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: true
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reservation_events: {
        Row: {
          event_time: string | null
          event_type: string | null
          id: number
          notes: string | null
          recorded_by: string | null
          reservation_id: number | null
        }
        Insert: {
          event_time?: string | null
          event_type?: string | null
          id?: never
          notes?: string | null
          recorded_by?: string | null
          reservation_id?: number | null
        }
        Update: {
          event_time?: string | null
          event_type?: string | null
          id?: never
          notes?: string | null
          recorded_by?: string | null
          reservation_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reservation_events_recorded_by_fkey"
            columns: ["recorded_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservation_events_reservation_id_fkey"
            columns: ["reservation_id"]
            isOneToOne: false
            referencedRelation: "reservations"
            referencedColumns: ["id"]
          },
        ]
      }
      reservations: {
        Row: {
          actual_duration_minutes: number | null
          arrival_time: string | null
          branch_id: number
          cancellation_reason: string | null
          cancelled_by: string | null
          created_at: string | null
          customer_name: string | null
          customer_phone: string | null
          estimated_duration_minutes: number | null
          finished_at: string | null
          id: number
          late_arrival: boolean | null
          no_show: boolean | null
          notes: string | null
          number_of_guests: number
          reservation_date: string
          reservation_time: string
          reservation_type: string
          seated_at: string | null
          status: string
          table_id: number | null
          user_id: string | null
          wait_time_minutes: number | null
        }
        Insert: {
          actual_duration_minutes?: number | null
          arrival_time?: string | null
          branch_id: number
          cancellation_reason?: string | null
          cancelled_by?: string | null
          created_at?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          estimated_duration_minutes?: number | null
          finished_at?: string | null
          id?: never
          late_arrival?: boolean | null
          no_show?: boolean | null
          notes?: string | null
          number_of_guests: number
          reservation_date: string
          reservation_time: string
          reservation_type: string
          seated_at?: string | null
          status?: string
          table_id?: number | null
          user_id?: string | null
          wait_time_minutes?: number | null
        }
        Update: {
          actual_duration_minutes?: number | null
          arrival_time?: string | null
          branch_id?: number
          cancellation_reason?: string | null
          cancelled_by?: string | null
          created_at?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          estimated_duration_minutes?: number | null
          finished_at?: string | null
          id?: never
          late_arrival?: boolean | null
          no_show?: boolean | null
          notes?: string | null
          number_of_guests?: number
          reservation_date?: string
          reservation_time?: string
          reservation_type?: string
          seated_at?: string | null
          status?: string
          table_id?: number | null
          user_id?: string | null
          wait_time_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reservations_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_table_id_fkey"
            columns: ["table_id"]
            isOneToOne: false
            referencedRelation: "tables"
            referencedColumns: ["id"]
          },
        ]
      }
      tables: {
        Row: {
          branch_id: number
          created_at: string
          id: number
          name: string | null
          places: number | null
          status: string | null
        }
        Insert: {
          branch_id: number
          created_at?: string
          id?: number
          name?: string | null
          places?: number | null
          status?: string | null
        }
        Update: {
          branch_id?: number
          created_at?: string
          id?: number
          name?: string | null
          places?: number | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tables_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone_number: string | null
          role: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone_number?: string | null
          role?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone_number?: string | null
          role?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
