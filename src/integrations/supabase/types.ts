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
      claims: {
        Row: {
          age: number
          claim_date: string
          claim_status: Database["public"]["Enums"]["claim_status"]
          created_at: string
          documents: Json | null
          email: string
          employer_name: string
          first_name: string
          id: string
          last_day_of_work: string | null
          last_name: string
          middle_name: string | null
          phone: string
          pincode: string
          reason_for_unemployment: string | null
          separation_reason: Database["public"]["Enums"]["separation_reason"]
          severance_amount: number | null
          severance_package: boolean | null
          ssn: string
          state: string
          updated_at: string
        }
        Insert: {
          age: number
          claim_date: string
          claim_status?: Database["public"]["Enums"]["claim_status"]
          created_at?: string
          documents?: Json | null
          email: string
          employer_name: string
          first_name: string
          id?: string
          last_day_of_work?: string | null
          last_name: string
          middle_name?: string | null
          phone: string
          pincode: string
          reason_for_unemployment?: string | null
          separation_reason: Database["public"]["Enums"]["separation_reason"]
          severance_amount?: number | null
          severance_package?: boolean | null
          ssn: string
          state: string
          updated_at?: string
        }
        Update: {
          age?: number
          claim_date?: string
          claim_status?: Database["public"]["Enums"]["claim_status"]
          created_at?: string
          documents?: Json | null
          email?: string
          employer_name?: string
          first_name?: string
          id?: string
          last_day_of_work?: string | null
          last_name?: string
          middle_name?: string | null
          phone?: string
          pincode?: string
          reason_for_unemployment?: string | null
          separation_reason?: Database["public"]["Enums"]["separation_reason"]
          severance_amount?: number | null
          severance_package?: boolean | null
          ssn?: string
          state?: string
          updated_at?: string
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
      claim_status: "initial_review" | "pending" | "approved" | "rejected"
      separation_reason:
        | "resignation"
        | "termination_misconduct"
        | "layoff"
        | "reduction_in_force"
        | "constructive_discharge"
        | "job_abandonment"
        | "severance_agreement"
    }
    CompositeTypes: {
      claims_definition: {
        id: string | null
        created_at: string | null
        updated_at: string | null
        first_name: string | null
        middle_name: string | null
        last_name: string | null
        age: number | null
        state: string | null
        pincode: string | null
        ssn: string | null
        email: string | null
        phone: string | null
        employer_name: string | null
        claim_date: string | null
        claim_status: Database["public"]["Enums"]["claim_status"] | null
        separation_reason:
          | Database["public"]["Enums"]["separation_reason"]
          | null
      }
      Database: {
        public: Json | null
      }
      json: {
        data: Json | null
      }
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
