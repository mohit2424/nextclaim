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
          claim_status: Database["public"]["Enums"]["old_claim_status"]
          created_at: string
          documents: Json | null
          email: string
          employer_name: string
          employment_end_date: string
          employment_start_date: string
          first_name: string
          id: string
          last_day_of_work: string | null
          last_name: string
          middle_name: string | null
          phone: string
          pincode: string
          reason_for_unemployment: string | null
          rejection_reason: string | null
          separation_reason: Database["public"]["Enums"]["separation_reason"]
          severance_amount: number | null
          severance_package: boolean | null
          ssn: string
          state: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          age: number
          claim_date: string
          claim_status?: Database["public"]["Enums"]["old_claim_status"]
          created_at?: string
          documents?: Json | null
          email: string
          employer_name: string
          employment_end_date: string
          employment_start_date: string
          first_name: string
          id: string
          last_day_of_work?: string | null
          last_name: string
          middle_name?: string | null
          phone: string
          pincode: string
          reason_for_unemployment?: string | null
          rejection_reason?: string | null
          separation_reason: Database["public"]["Enums"]["separation_reason"]
          severance_amount?: number | null
          severance_package?: boolean | null
          ssn: string
          state: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          age?: number
          claim_date?: string
          claim_status?: Database["public"]["Enums"]["old_claim_status"]
          created_at?: string
          documents?: Json | null
          email?: string
          employer_name?: string
          employment_end_date?: string
          employment_start_date?: string
          first_name?: string
          id?: string
          last_day_of_work?: string | null
          last_name?: string
          middle_name?: string | null
          phone?: string
          pincode?: string
          reason_for_unemployment?: string | null
          rejection_reason?: string | null
          separation_reason?: Database["public"]["Enums"]["separation_reason"]
          severance_amount?: number | null
          severance_package?: boolean | null
          ssn?: string
          state?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      in_progress_claims: {
        Row: {
          age: number | null
          claim_date: string | null
          claim_id: string | null
          documents: Json | null
          email: string | null
          employer_name: string | null
          employment_end_date: string | null
          employment_start_date: string | null
          first_name: string | null
          last_day_of_work: string | null
          last_name: string | null
          middle_name: string | null
          phone: string | null
          pincode: string | null
          reason_for_unemployment: string | null
          severance_amount: number | null
          severance_package: boolean | null
          ssn: string | null
          state: string | null
        }
        Insert: {
          age?: number | null
          claim_date?: string | null
          claim_id?: string | null
          documents?: Json | null
          email?: string | null
          employer_name?: string | null
          employment_end_date?: string | null
          employment_start_date?: string | null
          first_name?: string | null
          last_day_of_work?: string | null
          last_name?: string | null
          middle_name?: string | null
          phone?: string | null
          pincode?: string | null
          reason_for_unemployment?: string | null
          severance_amount?: number | null
          severance_package?: boolean | null
          ssn?: string | null
          state?: string | null
        }
        Update: {
          age?: number | null
          claim_date?: string | null
          claim_id?: string | null
          documents?: Json | null
          email?: string | null
          employer_name?: string | null
          employment_end_date?: string | null
          employment_start_date?: string | null
          first_name?: string | null
          last_day_of_work?: string | null
          last_name?: string | null
          middle_name?: string | null
          phone?: string | null
          pincode?: string | null
          reason_for_unemployment?: string | null
          severance_amount?: number | null
          severance_package?: boolean | null
          ssn?: string | null
          state?: string | null
        }
        Relationships: []
      }
      invalid_employment_dates: {
        Row: {
          claim_date: string | null
          claim_id: string | null
          employment_end_date: string | null
          employment_start_date: string | null
          first_name: string | null
          last_name: string | null
        }
        Insert: {
          claim_date?: string | null
          claim_id?: string | null
          employment_end_date?: string | null
          employment_start_date?: string | null
          first_name?: string | null
          last_name?: string | null
        }
        Update: {
          claim_date?: string | null
          claim_id?: string | null
          employment_end_date?: string | null
          employment_start_date?: string | null
          first_name?: string | null
          last_name?: string | null
        }
        Relationships: []
      }
      rejected_claims: {
        Row: {
          age: number | null
          claim_date: string | null
          claim_id: string | null
          documents: Json | null
          email: string | null
          employer_name: string | null
          employment_end_date: string | null
          employment_start_date: string | null
          first_name: string | null
          last_day_of_work: string | null
          last_name: string | null
          middle_name: string | null
          phone: string | null
          pincode: string | null
          reason_for_unemployment: string | null
          severance_amount: number | null
          severance_package: boolean | null
          ssn: string | null
          state: string | null
        }
        Insert: {
          age?: number | null
          claim_date?: string | null
          claim_id?: string | null
          documents?: Json | null
          email?: string | null
          employer_name?: string | null
          employment_end_date?: string | null
          employment_start_date?: string | null
          first_name?: string | null
          last_day_of_work?: string | null
          last_name?: string | null
          middle_name?: string | null
          phone?: string | null
          pincode?: string | null
          reason_for_unemployment?: string | null
          severance_amount?: number | null
          severance_package?: boolean | null
          ssn?: string | null
          state?: string | null
        }
        Update: {
          age?: number | null
          claim_date?: string | null
          claim_id?: string | null
          documents?: Json | null
          email?: string | null
          employer_name?: string | null
          employment_end_date?: string | null
          employment_start_date?: string | null
          first_name?: string | null
          last_day_of_work?: string | null
          last_name?: string | null
          middle_name?: string | null
          phone?: string | null
          pincode?: string | null
          reason_for_unemployment?: string | null
          severance_amount?: number | null
          severance_package?: boolean | null
          ssn?: string | null
          state?: string | null
        }
        Relationships: []
      }
      todays_claims: {
        Row: {
          age: number | null
          claim_date: string | null
          claim_id: string | null
          documents: Json | null
          email: string | null
          employer_name: string | null
          employment_end_date: string | null
          employment_start_date: string | null
          first_name: string | null
          last_day_of_work: string | null
          last_name: string | null
          middle_name: string | null
          phone: string | null
          pincode: string | null
          reason_for_unemployment: string | null
          severance_amount: number | null
          severance_package: boolean | null
          ssn: string | null
          state: string | null
        }
        Insert: {
          age?: number | null
          claim_date?: string | null
          claim_id?: string | null
          documents?: Json | null
          email?: string | null
          employer_name?: string | null
          employment_end_date?: string | null
          employment_start_date?: string | null
          first_name?: string | null
          last_day_of_work?: string | null
          last_name?: string | null
          middle_name?: string | null
          phone?: string | null
          pincode?: string | null
          reason_for_unemployment?: string | null
          severance_amount?: number | null
          severance_package?: boolean | null
          ssn?: string | null
          state?: string | null
        }
        Update: {
          age?: number | null
          claim_date?: string | null
          claim_id?: string | null
          documents?: Json | null
          email?: string | null
          employer_name?: string | null
          employment_end_date?: string | null
          employment_start_date?: string | null
          first_name?: string | null
          last_day_of_work?: string | null
          last_name?: string | null
          middle_name?: string | null
          phone?: string | null
          pincode?: string | null
          reason_for_unemployment?: string | null
          severance_amount?: number | null
          severance_package?: boolean | null
          ssn?: string | null
          state?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      binary_quantize:
        | {
            Args: {
              "": string
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      check_claim_eligibility: {
        Args: {
          start_date: string
          end_date: string
        }
        Returns: boolean
      }
      halfvec_avg: {
        Args: {
          "": number[]
        }
        Returns: unknown
      }
      halfvec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      halfvec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      hnsw_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      l2_norm:
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      l2_normalize:
        | {
            Args: {
              "": string
            }
            Returns: string
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
        | {
            Args: {
              "": unknown
            }
            Returns: unknown
          }
      sparsevec_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      sparsevec_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
      validate_ssn: {
        Args: {
          ssn: string
        }
        Returns: boolean
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims:
        | {
            Args: {
              "": string
            }
            Returns: number
          }
        | {
            Args: {
              "": unknown
            }
            Returns: number
          }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      claim_status: "initial_review" | "in_progress" | "rejected"
      claim_status_type: "initial_review" | "in_progress" | "rejected"
      old_claim_status: "initial_review" | "in_progress" | "rejected"
      separation_reason:
        | "resignation"
        | "termination_misconduct"
        | "layoff"
        | "reduction_in_force"
        | "constructive_discharge"
        | "job_abandonment"
        | "severance_agreement"
      separation_reason_type:
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
        claim_status: Database["public"]["Enums"]["old_claim_status"] | null
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
