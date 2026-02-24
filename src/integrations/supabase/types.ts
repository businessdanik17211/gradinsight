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
      admission_stats: {
        Row: {
          applications_count: number | null
          avg_score: number | null
          budget_places: number | null
          created_at: string
          enrolled_count: number | null
          id: string
          min_score: number | null
          paid_places: number | null
          specialty_id: string
          year: number
        }
        Insert: {
          applications_count?: number | null
          avg_score?: number | null
          budget_places?: number | null
          created_at?: string
          enrolled_count?: number | null
          id?: string
          min_score?: number | null
          paid_places?: number | null
          specialty_id: string
          year: number
        }
        Update: {
          applications_count?: number | null
          avg_score?: number | null
          budget_places?: number | null
          created_at?: string
          enrolled_count?: number | null
          id?: string
          min_score?: number | null
          paid_places?: number | null
          specialty_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "admission_stats_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "specialties"
            referencedColumns: ["id"]
          },
        ]
      }
      career_paths: {
        Row: {
          created_at: string
          description: string | null
          id: string
          level_name: string
          level_order: number
          specialty_category: string
          typical_salary_max: number | null
          typical_salary_min: number | null
          years_experience: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          level_name: string
          level_order: number
          specialty_category: string
          typical_salary_max?: number | null
          typical_salary_min?: number | null
          years_experience?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          level_name?: string
          level_order?: number
          specialty_category?: string
          typical_salary_max?: number | null
          typical_salary_min?: number | null
          years_experience?: string | null
        }
        Relationships: []
      }
      faculties: {
        Row: {
          code: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          university_id: string
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          university_id: string
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          university_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faculties_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      institutes: {
        Row: {
          code: string | null
          created_at: string
          description: string | null
          id: string
          name: string
          university_id: string
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
          university_id: string
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          university_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "institutes_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      salary_stats: {
        Row: {
          avg_salary: number
          career_growth_potential: string | null
          category: string
          city: string | null
          created_at: string
          demand_level: string | null
          id: string
          max_salary: number | null
          min_salary: number | null
          month: number | null
          source: string | null
          specialty_name: string | null
          vacancies_count: number | null
          year: number
        }
        Insert: {
          avg_salary: number
          career_growth_potential?: string | null
          category: string
          city?: string | null
          created_at?: string
          demand_level?: string | null
          id?: string
          max_salary?: number | null
          min_salary?: number | null
          month?: number | null
          source?: string | null
          specialty_name?: string | null
          vacancies_count?: number | null
          year: number
        }
        Update: {
          avg_salary?: number
          career_growth_potential?: string | null
          category?: string
          city?: string | null
          created_at?: string
          demand_level?: string | null
          id?: string
          max_salary?: number | null
          min_salary?: number | null
          month?: number | null
          source?: string | null
          specialty_name?: string | null
          vacancies_count?: number | null
          year?: number
        }
        Relationships: []
      }
      specialties: {
        Row: {
          code: string | null
          created_at: string
          degree_type: string
          description: string | null
          duration_years: number
          faculty_id: string | null
          id: string
          institute_id: string | null
          name: string
          updated_at: string
        }
        Insert: {
          code?: string | null
          created_at?: string
          degree_type?: string
          description?: string | null
          duration_years?: number
          faculty_id?: string | null
          id?: string
          institute_id?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          code?: string | null
          created_at?: string
          degree_type?: string
          description?: string | null
          duration_years?: number
          faculty_id?: string | null
          id?: string
          institute_id?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "specialties_faculty_id_fkey"
            columns: ["faculty_id"]
            isOneToOne: false
            referencedRelation: "faculties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specialties_institute_id_fkey"
            columns: ["institute_id"]
            isOneToOne: false
            referencedRelation: "institutes"
            referencedColumns: ["id"]
          },
        ]
      }
      universities: {
        Row: {
          city: string
          created_at: string
          description: string | null
          full_name: string
          id: string
          logo_url: string | null
          short_name: string
          updated_at: string
          website: string | null
        }
        Insert: {
          city: string
          created_at?: string
          description?: string | null
          full_name: string
          id?: string
          logo_url?: string | null
          short_name: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          city?: string
          created_at?: string
          description?: string | null
          full_name?: string
          id?: string
          logo_url?: string | null
          short_name?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vacancies: {
        Row: {
          category: string
          city: string | null
          company: string | null
          created_at: string
          description: string | null
          employment_type: string | null
          experience_required: string | null
          id: string
          parsed_at: string
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          source_url: string | null
          title: string
        }
        Insert: {
          category: string
          city?: string | null
          company?: string | null
          created_at?: string
          description?: string | null
          employment_type?: string | null
          experience_required?: string | null
          id?: string
          parsed_at?: string
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          source_url?: string | null
          title: string
        }
        Update: {
          category?: string
          city?: string | null
          company?: string | null
          created_at?: string
          description?: string | null
          employment_type?: string | null
          experience_required?: string | null
          id?: string
          parsed_at?: string
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          source_url?: string | null
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      get_vacancy_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string
          count: number
          avg_salary_min: number
          avg_salary_max: number
          avg_salary: number
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
