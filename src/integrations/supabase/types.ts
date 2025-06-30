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
      articles: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string | null
          id: string
          image_url: string | null
          slug: string
          title: string
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          slug: string
          title: string
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          slug?: string
          title?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          booking_status: string
          check_in_date: string
          check_out_date: string
          created_at: string | null
          guest_id: string
          id: string
          room_id: string
        }
        Insert: {
          booking_status?: string
          check_in_date: string
          check_out_date: string
          created_at?: string | null
          guest_id: string
          id?: string
          room_id: string
        }
        Update: {
          booking_status?: string
          check_in_date?: string
          check_out_date?: string
          created_at?: string | null
          guest_id?: string
          id?: string
          room_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string | null
          full_name?: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
      rooms: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_urls: string[] | null
          name: string
          price: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_urls?: string[] | null
          name: string
          price?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_urls?: string[] | null
          name?: string
          price?: number | null
        }
        Relationships: []
      }
      tree_updates: {
        Row: {
          activity: string
          created_at: string | null
          id: string
          image_url: string | null
          notes: string | null
          tree_id: string | null
        }
        Insert: {
          activity: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          notes?: string | null
          tree_id?: string | null
        }
        Update: {
          activity?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          notes?: string | null
          tree_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tree_updates_tree_id_fkey"
            columns: ["tree_id"]
            isOneToOne: false
            referencedRelation: "trees"
            referencedColumns: ["id"]
          },
        ]
      }
      trees: {
        Row: {
          created_at: string | null
          current_renter_id: string | null
          description: string | null
          id: string
          image_url: string | null
          name: string
          status: string | null
          type: string | null
        }
        Insert: {
          created_at?: string | null
          current_renter_id?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          status?: string | null
          type?: string | null
        }
        Update: {
          created_at?: string | null
          current_renter_id?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          status?: string | null
          type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_my_claim: {
        Args: { claim: string }
        Returns: Json
      }
    }
    Enums: {
      tree_status: "Available" | "Rented"
      user_role: "owner" | "staff" | "customer" | "admin"
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
    Enums: {
      tree_status: ["Available", "Rented"],
      user_role: ["owner", "staff", "customer", "admin"],
    },
  },
} as const
