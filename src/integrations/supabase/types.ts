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
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: number
          message: string
          name: string
          status: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          message: string
          name: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          message?: string
          name?: string
          status?: string
        }
        Relationships: []
      }
      menu_items: {
        Row: {
          category: string
          description: string | null
          id: number
          imagesrc: string | null
          isspicy: boolean | null
          isvegetarian: boolean | null
          name: string
          price: string
          sold_out: boolean
          square_variation_id: string | null
        }
        Insert: {
          category: string
          description?: string | null
          id?: number
          imagesrc?: string | null
          isspicy?: boolean | null
          isvegetarian?: boolean | null
          name: string
          price: string
          sold_out?: boolean
          square_variation_id?: string | null
        }
        Update: {
          category?: string
          description?: string | null
          id?: number
          imagesrc?: string | null
          isspicy?: boolean | null
          isvegetarian?: boolean | null
          name?: string
          price?: string
          sold_out?: boolean
          square_variation_id?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          delivery_address: string | null
          id: number
          items: Json
          order_type: string
          payment_id: string | null
          pickup_time: string | null
          special_instructions: string | null
          status: string
          total_amount: number
        }
        Insert: {
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          delivery_address?: string | null
          id?: number
          items: Json
          order_type?: string
          payment_id?: string | null
          pickup_time?: string | null
          special_instructions?: string | null
          status?: string
          total_amount: number
        }
        Update: {
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          delivery_address?: string | null
          id?: number
          items?: Json
          order_type?: string
          payment_id?: string | null
          pickup_time?: string | null
          special_instructions?: string | null
          status?: string
          total_amount?: number
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
