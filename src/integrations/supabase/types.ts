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
      blog_posts: {
        Row: {
          author: string
          category: string
          content: string
          cover_image_url: string | null
          created_at: string
          id: string
          published: boolean
          published_at: string | null
          slug: string
          summary: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          category?: string
          content: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          published_at?: string | null
          slug: string
          summary?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          cover_image_url?: string | null
          created_at?: string
          id?: string
          published?: boolean
          published_at?: string | null
          slug?: string
          summary?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_insights: {
        Row: {
          content: string
          created_at: string | null
          generated_at: string | null
          id: string
          market: string
          sentiment: string
        }
        Insert: {
          content: string
          created_at?: string | null
          generated_at?: string | null
          id?: string
          market?: string
          sentiment?: string
        }
        Update: {
          content?: string
          created_at?: string | null
          generated_at?: string | null
          id?: string
          market?: string
          sentiment?: string
        }
        Relationships: []
      }
      extraction_logs: {
        Row: {
          average_variation: number | null
          created_at: string | null
          error_message: string | null
          execution_id: string | null
          execution_time: string
          first_symbol: string | null
          id: string
          last_symbol: string | null
          status: string
          total_stocks_processed: number | null
          workflow_name: string
        }
        Insert: {
          average_variation?: number | null
          created_at?: string | null
          error_message?: string | null
          execution_id?: string | null
          execution_time: string
          first_symbol?: string | null
          id?: string
          last_symbol?: string | null
          status: string
          total_stocks_processed?: number | null
          workflow_name: string
        }
        Update: {
          average_variation?: number | null
          created_at?: string | null
          error_message?: string | null
          execution_id?: string | null
          execution_time?: string
          first_symbol?: string | null
          id?: string
          last_symbol?: string | null
          status?: string
          total_stocks_processed?: number | null
          workflow_name?: string
        }
        Relationships: []
      }
      portfolio: {
        Row: {
          avg_price: number
          created_at: string
          id: string
          logo: string | null
          name: string
          purchased_at: string | null
          quantity: number
          symbol: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avg_price?: number
          created_at?: string
          id?: string
          logo?: string | null
          name: string
          purchased_at?: string | null
          quantity?: number
          symbol: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avg_price?: number
          created_at?: string
          id?: string
          logo?: string | null
          name?: string
          purchased_at?: string | null
          quantity?: number
          symbol?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      price_alerts: {
        Row: {
          created_at: string
          direction: string
          id: string
          is_active: boolean
          name: string
          symbol: string
          target_price: number
          triggered_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          direction?: string
          id?: string
          is_active?: boolean
          name: string
          symbol: string
          target_price: number
          triggered_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          direction?: string
          id?: string
          is_active?: boolean
          name?: string
          symbol?: string
          target_price?: number
          triggered_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          is_active_plan: boolean
          phone_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_active_plan?: boolean
          phone_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_active_plan?: boolean
          phone_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stock_prices: {
        Row: {
          auto_insight: string | null
          brapi_change: number | null
          brapi_change_percent: number | null
          created_at: string | null
          currency: string | null
          current_price: number
          distance_from_52week_high: number | null
          distance_from_52week_low: number | null
          earnings_per_share: number | null
          fifty_two_week_high: number | null
          fifty_two_week_low: number | null
          high_price: number | null
          id: string
          logo_url: string | null
          long_name: string | null
          low_price: number | null
          market_cap: number | null
          market_time: string
          open_price: number | null
          position_52week_range: number | null
          previous_close: number | null
          price_earnings: number | null
          processed_at: string | null
          range_position: string | null
          short_name: string | null
          symbol: string
          trend: string | null
          trend_emoji: string | null
          variation_daily: number | null
          variation_from_close: number | null
          volatility_intraday: number | null
          volatility_level: string | null
          volume: number | null
        }
        Insert: {
          auto_insight?: string | null
          brapi_change?: number | null
          brapi_change_percent?: number | null
          created_at?: string | null
          currency?: string | null
          current_price: number
          distance_from_52week_high?: number | null
          distance_from_52week_low?: number | null
          earnings_per_share?: number | null
          fifty_two_week_high?: number | null
          fifty_two_week_low?: number | null
          high_price?: number | null
          id?: string
          logo_url?: string | null
          long_name?: string | null
          low_price?: number | null
          market_cap?: number | null
          market_time: string
          open_price?: number | null
          position_52week_range?: number | null
          previous_close?: number | null
          price_earnings?: number | null
          processed_at?: string | null
          range_position?: string | null
          short_name?: string | null
          symbol: string
          trend?: string | null
          trend_emoji?: string | null
          variation_daily?: number | null
          variation_from_close?: number | null
          volatility_intraday?: number | null
          volatility_level?: string | null
          volume?: number | null
        }
        Update: {
          auto_insight?: string | null
          brapi_change?: number | null
          brapi_change_percent?: number | null
          created_at?: string | null
          currency?: string | null
          current_price?: number
          distance_from_52week_high?: number | null
          distance_from_52week_low?: number | null
          earnings_per_share?: number | null
          fifty_two_week_high?: number | null
          fifty_two_week_low?: number | null
          high_price?: number | null
          id?: string
          logo_url?: string | null
          long_name?: string | null
          low_price?: number | null
          market_cap?: number | null
          market_time?: string
          open_price?: number | null
          position_52week_range?: number | null
          previous_close?: number | null
          price_earnings?: number | null
          processed_at?: string | null
          range_position?: string | null
          short_name?: string | null
          symbol?: string
          trend?: string | null
          trend_emoji?: string | null
          variation_daily?: number | null
          variation_from_close?: number | null
          volatility_intraday?: number | null
          volatility_level?: string | null
          volume?: number | null
        }
        Relationships: []
      }
      stock_quotes: {
        Row: {
          change_percent: number
          created_at: string
          currency: string
          fetched_at: string
          id: string
          market: string
          name: string
          price: number
          symbol: string
          volume: number
        }
        Insert: {
          change_percent?: number
          created_at?: string
          currency?: string
          fetched_at?: string
          id?: string
          market: string
          name: string
          price: number
          symbol: string
          volume?: number
        }
        Update: {
          change_percent?: number
          created_at?: string
          currency?: string
          fetched_at?: string
          id?: string
          market?: string
          name?: string
          price?: number
          symbol?: string
          volume?: number
        }
        Relationships: []
      }
      stock_rankings: {
        Row: {
          calculated_at: string
          daily_change: number
          id: string
          market: string
          monthly_change: number | null
          name: string
          rank_position: number
          symbol: string
          weekly_change: number | null
        }
        Insert: {
          calculated_at?: string
          daily_change?: number
          id?: string
          market: string
          monthly_change?: number | null
          name: string
          rank_position: number
          symbol: string
          weekly_change?: number | null
        }
        Update: {
          calculated_at?: string
          daily_change?: number
          id?: string
          market?: string
          monthly_change?: number | null
          name?: string
          rank_position?: number
          symbol?: string
          weekly_change?: number | null
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          source: string
          status: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          source?: string
          status: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          source?: string
          status?: string
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
