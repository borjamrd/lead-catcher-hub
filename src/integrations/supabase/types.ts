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
      answers: {
        Row: {
          id: string
          is_correct: boolean | null
          question_id: string | null
          text: string
        }
        Insert: {
          id?: string
          is_correct?: boolean | null
          question_id?: string | null
          text: string
        }
        Update: {
          id?: string
          is_correct?: boolean | null
          question_id?: string | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      blocks: {
        Row: {
          description: string | null
          id: string
          name: string
          opposition_id: string | null
          position: number
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          opposition_id?: string | null
          position?: number
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          opposition_id?: string | null
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "blocks_opposition_id_fkey"
            columns: ["opposition_id"]
            isOneToOne: false
            referencedRelation: "oppositions"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_url_subscriptions: {
        Row: {
          created_at: string
          id: string
          lead_id: string
          url_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lead_id: string
          url_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lead_id?: string
          url_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_url_subscriptions_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_url_subscriptions_url_id_fkey"
            columns: ["url_id"]
            isOneToOne: false
            referencedRelation: "urls"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      note_blocks: {
        Row: {
          content: Json | null
          created_at: string
          id: string
          note_id: string
          parent_id: string | null
          position: number
          type: string
          updated_at: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          id?: string
          note_id: string
          parent_id?: string | null
          position: number
          type: string
          updated_at?: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          id?: string
          note_id?: string
          parent_id?: string | null
          position?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blocks_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "note_blocks_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "note_blocks"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_info: {
        Row: {
          available_hours: number
          created_at: string | null
          id: string
          objectives: Json | null
          opposition_id: string | null
          study_days: number
          user_id: string
        }
        Insert: {
          available_hours: number
          created_at?: string | null
          id?: string
          objectives?: Json | null
          opposition_id?: string | null
          study_days: number
          user_id: string
        }
        Update: {
          available_hours?: number
          created_at?: string | null
          id?: string
          objectives?: Json | null
          opposition_id?: string | null
          study_days?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "onboarding_info_opposition_id_fkey"
            columns: ["opposition_id"]
            isOneToOne: false
            referencedRelation: "oppositions"
            referencedColumns: ["id"]
          },
        ]
      }
      opposition_resources: {
        Row: {
          opposition_id: string
          resource_id: string
        }
        Insert: {
          opposition_id: string
          resource_id: string
        }
        Update: {
          opposition_id?: string
          resource_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opposition_resources_opposition_id_fkey"
            columns: ["opposition_id"]
            isOneToOne: false
            referencedRelation: "oppositions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opposition_resources_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      oppositions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          id: string
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id: string
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      questions: {
        Row: {
          id: string
          test_id: string | null
          text: string
        }
        Insert: {
          id?: string
          test_id?: string | null
          text: string
        }
        Update: {
          id?: string
          test_id?: string | null
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_blocks: {
        Row: {
          block_id: string | null
          id: string
          resource_id: string | null
        }
        Insert: {
          block_id?: string | null
          id?: string
          resource_id?: string | null
        }
        Update: {
          block_id?: string | null
          id?: string
          resource_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_blocks_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_blocks_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_oppositions: {
        Row: {
          id: string
          opposition_id: string | null
          resource_id: string | null
        }
        Insert: {
          id?: string
          opposition_id?: string | null
          resource_id?: string | null
        }
        Update: {
          id?: string
          opposition_id?: string | null
          resource_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_oppositions_opposition_id_fkey"
            columns: ["opposition_id"]
            isOneToOne: false
            referencedRelation: "oppositions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_oppositions_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      resource_topics: {
        Row: {
          id: string
          resource_id: string | null
          topic_id: string | null
        }
        Insert: {
          id?: string
          resource_id?: string | null
          topic_id?: string | null
        }
        Update: {
          id?: string
          resource_id?: string | null
          topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resource_topics_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resource_topics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          created_at: string | null
          id: string
          title: string
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          title: string
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string
          url?: string
        }
        Relationships: []
      }
      study_cycles: {
        Row: {
          completed_at: string | null
          cycle_number: number
          id: string
          opposition_id: string
          started_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          cycle_number: number
          id?: string
          opposition_id: string
          started_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          cycle_number?: number
          id?: string
          opposition_id?: string
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_cycles_opposition_id_fkey"
            columns: ["opposition_id"]
            isOneToOne: false
            referencedRelation: "oppositions"
            referencedColumns: ["id"]
          },
        ]
      }
      study_sounds: {
        Row: {
          created_at: string | null
          id: string
          name: string
          url: string
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          url: string
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          url?: string
          value?: string
        }
        Relationships: []
      }
      test_attempts: {
        Row: {
          completed_at: string | null
          correct_answers: number | null
          id: string
          opposition_id: string
          score: number | null
          study_cycle_id: string
          test_id: string
          total_questions: number | null
          user_id: string
          wrong_answers: number | null
        }
        Insert: {
          completed_at?: string | null
          correct_answers?: number | null
          id?: string
          opposition_id: string
          score?: number | null
          study_cycle_id: string
          test_id: string
          total_questions?: number | null
          user_id: string
          wrong_answers?: number | null
        }
        Update: {
          completed_at?: string | null
          correct_answers?: number | null
          id?: string
          opposition_id?: string
          score?: number | null
          study_cycle_id?: string
          test_id?: string
          total_questions?: number | null
          user_id?: string
          wrong_answers?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "test_attempts_opposition_id_fkey"
            columns: ["opposition_id"]
            isOneToOne: false
            referencedRelation: "oppositions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_attempts_study_cycle_id_fkey"
            columns: ["study_cycle_id"]
            isOneToOne: false
            referencedRelation: "study_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_attempts_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          id: string
          opposition_id: string
          title: string
          topic_id: string | null
        }
        Insert: {
          id?: string
          opposition_id: string
          title: string
          topic_id?: string | null
        }
        Update: {
          id?: string
          opposition_id?: string
          title?: string
          topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_opposition"
            columns: ["opposition_id"]
            isOneToOne: false
            referencedRelation: "oppositions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tests_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          block_id: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          position: number
        }
        Insert: {
          block_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          position?: number
        }
        Update: {
          block_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          position?: number
        }
        Relationships: [
          {
            foreignKeyName: "topics_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "blocks"
            referencedColumns: ["id"]
          },
        ]
      }
      urls: {
        Row: {
          active: boolean | null
          created_at: string
          description: string
          id: string
          name: string
          url: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          description?: string
          id?: string
          name: string
          url: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          description?: string
          id?: string
          name?: string
          url?: string
        }
        Relationships: []
      }
      user_oppositions: {
        Row: {
          active: boolean | null
          enrolled_at: string | null
          id: string
          opposition_id: string | null
          profile_id: string | null
        }
        Insert: {
          active?: boolean | null
          enrolled_at?: string | null
          id?: string
          opposition_id?: string | null
          profile_id?: string | null
        }
        Update: {
          active?: boolean | null
          enrolled_at?: string | null
          id?: string
          opposition_id?: string | null
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_oppositions_opposition_id_fkey"
            columns: ["opposition_id"]
            isOneToOne: false
            referencedRelation: "oppositions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_oppositions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
      user_url_subscriptions: {
        Row: {
          created_at: string
          id: string
          url_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          url_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          url_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_url_subscriptions_url_id_fkey"
            columns: ["url_id"]
            isOneToOne: false
            referencedRelation: "urls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_url_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      url_subscriptions_with_emails: {
        Row: {
          email: string | null
          subscription_date: string | null
          subscription_type: string | null
          url: string | null
          url_id: string | null
          url_name: string | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      list_oppositions_with_user_count: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          name: string
          user_count: number
        }[]
      }
      list_user_oppositions: {
        Args: {
          profile_id: string
        }
        Returns: {
          id: string
          name: string
          is_assigned: boolean
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
