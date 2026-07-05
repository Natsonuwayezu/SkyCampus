// ============================================================
// SkyCampus Database Types
// Auto-generate with: supabase gen types typescript --local
// This is a manual version for development start
// ============================================================

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      schools: {
        Row: {
          id: string
          name: string
          slug: string
          country: string
          city: string | null
          phone: string | null
          email: string | null
          logo_url: string | null
          primary_color: string
          secondary_color: string
          motto: string | null
          director_name: string | null
          has_nursery: boolean
          has_primary: boolean
          has_secondary: boolean
          plan: string
          plan_expires_at: string | null
          status: string
          promotion_min: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['schools']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['schools']['Insert']>
      }
      users: {
        Row: {
          id: string
          school_id: string | null
          role_id: string | null
          full_name: string
          username: string | null
          phone: string | null
          avatar_url: string | null
          push_token: string | null
          is_active: boolean
          last_login: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      roles: {
        Row: {
          id: string
          school_id: string
          name: string
          description: string | null
          is_system_role: boolean
          color: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['roles']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['roles']['Insert']>
      }
      students: {
        Row: {
          id: string
          school_id: string
          admission_number: string
          first_name: string
          last_name: string
          date_of_birth: string | null
          gender: string | null
          nationality: string
          national_id: string | null
          blood_group: string | null
          religion: string | null
          home_address: string | null
          district: string | null
          village: string | null
          photo_url: string | null
          previous_school: string | null
          status: string
          enrolled_at: string
          archived_at: string | null
          archive_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['students']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['students']['Insert']>
      }
      marks: {
        Row: {
          id: string
          school_id: string
          student_id: string
          assessment_id: string
          score: number
          grade: string | null
          entered_by: string | null
          entered_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['marks']['Row'], 'id' | 'entered_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['marks']['Insert']>
      }
      payments: {
        Row: {
          id: string
          school_id: string
          student_id: string
          receipt_number: string
          total_amount: number
          payment_method: string
          reference_number: string | null
          payment_date: string
          notes: string | null
          is_reversed: boolean
          reversed_at: string | null
          reversed_by: string | null
          reversal_reason: string | null
          recorded_by: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['payments']['Insert']>
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      generate_admission_number: { Args: { p_school_id: string }; Returns: string }
      generate_receipt_number: { Args: { p_school_id: string }; Returns: string }
      get_grade: { Args: { p_school_id: string; p_percentage: number }; Returns: string }
    }
    Enums: { [_ in never]: never }
  }
}

// Convenience types
export type School = Database['public']['Tables']['schools']['Row']
export type User = Database['public']['Tables']['users']['Row']
export type Role = Database['public']['Tables']['roles']['Row']
export type Student = Database['public']['Tables']['students']['Row']
export type Mark = Database['public']['Tables']['marks']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
