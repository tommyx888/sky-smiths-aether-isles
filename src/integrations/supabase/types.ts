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
      buildings: {
        Row: {
          created_at: string
          id: string
          island_id: string
          level: number
          position_x: number
          position_y: number
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          island_id: string
          level?: number
          position_x: number
          position_y: number
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          island_id?: string
          level?: number
          position_x?: number
          position_y?: number
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "buildings_island_id_fkey"
            columns: ["island_id"]
            isOneToOne: false
            referencedRelation: "player_islands"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          accommodation: string | null
          average_salaries: string | null
          bank_account: string | null
          banking_and_currency: string | null
          business_etiquette: string | null
          capital: string
          child_care: string | null
          climate_average_temp: string | null
          climate_data: string | null
          climate_rainfall: string | null
          climate_type: string | null
          common_scams: string | null
          communication_services: string | null
          cost_of_living: string | null
          cultural_norms: string | null
          currency: string
          customs_regulations: string | null
          driving_regulations: string | null
          economy_agriculture: string | null
          economy_gdp: string | null
          economy_industry: string | null
          economy_major_industries: string | null
          economy_services: string | null
          education_system: string | null
          electrical_information: string | null
          embassy_registration: string | null
          emergency_services: string | null
          flag_code: string
          gender_equality: string | null
          geography_area: string | null
          geography_coastline: string | null
          geography_terrain: string | null
          grocery_shopping: string | null
          healthcare_services: string | null
          healthcare_system: string | null
          homesickness_culture_shock: string | null
          housing_options: string | null
          id: number
          job_market_overview: string | null
          language: string
          language_courses: string | null
          language_requirements: string | null
          laws_and_regulations: string | null
          legal_aid: string | null
          leisure_activities: string | null
          lgbt_rights: string | null
          libraries_community: string | null
          local_cuisine: string | null
          local_customs: string | null
          local_id: string | null
          local_media: string | null
          local_registration: string | null
          mental_health: string | null
          mobile_and_internet: string | null
          name: string
          notable_facts: string[] | null
          pet_relocation: string | null
          places_of_worship: string | null
          political_system: string | null
          population: string
          postal_services: string | null
          professional_networks: string | null
          public_holidays: string | null
          public_transportation: string | null
          qualifications_recognition: string | null
          religious_landscape: string | null
          social_security: string | null
          social_security_tax: string | null
          sports_facilities: string | null
          taxation_for_expatriates: string | null
          time_zone: string | null
          transportation: string | null
          utility_bills: string | null
          visa_requirements: string | null
          volunteer_opportunities: string | null
          waste_management: string | null
          work_permit: string | null
          workers_rights: string | null
          workplace_dynamics: string | null
        }
        Insert: {
          accommodation?: string | null
          average_salaries?: string | null
          bank_account?: string | null
          banking_and_currency?: string | null
          business_etiquette?: string | null
          capital: string
          child_care?: string | null
          climate_average_temp?: string | null
          climate_data?: string | null
          climate_rainfall?: string | null
          climate_type?: string | null
          common_scams?: string | null
          communication_services?: string | null
          cost_of_living?: string | null
          cultural_norms?: string | null
          currency: string
          customs_regulations?: string | null
          driving_regulations?: string | null
          economy_agriculture?: string | null
          economy_gdp?: string | null
          economy_industry?: string | null
          economy_major_industries?: string | null
          economy_services?: string | null
          education_system?: string | null
          electrical_information?: string | null
          embassy_registration?: string | null
          emergency_services?: string | null
          flag_code: string
          gender_equality?: string | null
          geography_area?: string | null
          geography_coastline?: string | null
          geography_terrain?: string | null
          grocery_shopping?: string | null
          healthcare_services?: string | null
          healthcare_system?: string | null
          homesickness_culture_shock?: string | null
          housing_options?: string | null
          id?: number
          job_market_overview?: string | null
          language: string
          language_courses?: string | null
          language_requirements?: string | null
          laws_and_regulations?: string | null
          legal_aid?: string | null
          leisure_activities?: string | null
          lgbt_rights?: string | null
          libraries_community?: string | null
          local_cuisine?: string | null
          local_customs?: string | null
          local_id?: string | null
          local_media?: string | null
          local_registration?: string | null
          mental_health?: string | null
          mobile_and_internet?: string | null
          name: string
          notable_facts?: string[] | null
          pet_relocation?: string | null
          places_of_worship?: string | null
          political_system?: string | null
          population: string
          postal_services?: string | null
          professional_networks?: string | null
          public_holidays?: string | null
          public_transportation?: string | null
          qualifications_recognition?: string | null
          religious_landscape?: string | null
          social_security?: string | null
          social_security_tax?: string | null
          sports_facilities?: string | null
          taxation_for_expatriates?: string | null
          time_zone?: string | null
          transportation?: string | null
          utility_bills?: string | null
          visa_requirements?: string | null
          volunteer_opportunities?: string | null
          waste_management?: string | null
          work_permit?: string | null
          workers_rights?: string | null
          workplace_dynamics?: string | null
        }
        Update: {
          accommodation?: string | null
          average_salaries?: string | null
          bank_account?: string | null
          banking_and_currency?: string | null
          business_etiquette?: string | null
          capital?: string
          child_care?: string | null
          climate_average_temp?: string | null
          climate_data?: string | null
          climate_rainfall?: string | null
          climate_type?: string | null
          common_scams?: string | null
          communication_services?: string | null
          cost_of_living?: string | null
          cultural_norms?: string | null
          currency?: string
          customs_regulations?: string | null
          driving_regulations?: string | null
          economy_agriculture?: string | null
          economy_gdp?: string | null
          economy_industry?: string | null
          economy_major_industries?: string | null
          economy_services?: string | null
          education_system?: string | null
          electrical_information?: string | null
          embassy_registration?: string | null
          emergency_services?: string | null
          flag_code?: string
          gender_equality?: string | null
          geography_area?: string | null
          geography_coastline?: string | null
          geography_terrain?: string | null
          grocery_shopping?: string | null
          healthcare_services?: string | null
          healthcare_system?: string | null
          homesickness_culture_shock?: string | null
          housing_options?: string | null
          id?: number
          job_market_overview?: string | null
          language?: string
          language_courses?: string | null
          language_requirements?: string | null
          laws_and_regulations?: string | null
          legal_aid?: string | null
          leisure_activities?: string | null
          lgbt_rights?: string | null
          libraries_community?: string | null
          local_cuisine?: string | null
          local_customs?: string | null
          local_id?: string | null
          local_media?: string | null
          local_registration?: string | null
          mental_health?: string | null
          mobile_and_internet?: string | null
          name?: string
          notable_facts?: string[] | null
          pet_relocation?: string | null
          places_of_worship?: string | null
          political_system?: string | null
          population?: string
          postal_services?: string | null
          professional_networks?: string | null
          public_holidays?: string | null
          public_transportation?: string | null
          qualifications_recognition?: string | null
          religious_landscape?: string | null
          social_security?: string | null
          social_security_tax?: string | null
          sports_facilities?: string | null
          taxation_for_expatriates?: string | null
          time_zone?: string | null
          transportation?: string | null
          utility_bills?: string | null
          visa_requirements?: string | null
          volunteer_opportunities?: string | null
          waste_management?: string | null
          work_permit?: string | null
          workers_rights?: string | null
          workplace_dynamics?: string | null
        }
        Relationships: []
      }
      cvs: {
        Row: {
          created_at: string
          education: Json[]
          gdpr_accepted: boolean | null
          gdpr_accepted_at: string | null
          id: string
          interested_roles: string[]
          languages: Json[]
          personal_info: Json
          search_text: unknown | null
          skills: Json | null
          status: string | null
          target_countries: string[]
          updated_at: string
          user_id: string
          work_experience: Json[]
        }
        Insert: {
          created_at?: string
          education?: Json[]
          gdpr_accepted?: boolean | null
          gdpr_accepted_at?: string | null
          id?: string
          interested_roles?: string[]
          languages?: Json[]
          personal_info?: Json
          search_text?: unknown | null
          skills?: Json | null
          status?: string | null
          target_countries?: string[]
          updated_at?: string
          user_id: string
          work_experience?: Json[]
        }
        Update: {
          created_at?: string
          education?: Json[]
          gdpr_accepted?: boolean | null
          gdpr_accepted_at?: string | null
          id?: string
          interested_roles?: string[]
          languages?: Json[]
          personal_info?: Json
          search_text?: unknown | null
          skills?: Json | null
          status?: string | null
          target_countries?: string[]
          updated_at?: string
          user_id?: string
          work_experience?: Json[]
        }
        Relationships: []
      }
      favorites: {
        Row: {
          country: string | null
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          country?: string | null
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          country?: string | null
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applicant_email: string
          created_at: string
          employer_email: string
          id: number
          job_id: number | null
          status: string
        }
        Insert: {
          applicant_email: string
          created_at?: string
          employer_email: string
          id?: number
          job_id?: number | null
          status: string
        }
        Update: {
          applicant_email?: string
          created_at?: string
          employer_email?: string
          id?: number
          job_id?: number | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "job_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      job_listings: {
        Row: {
          application_deadline: string | null
          benefits: string | null
          city: string
          company_name: string
          contact_email: string
          contact_phone: string | null
          country: string
          created_at: string
          id: number
          job_description: string
          job_title: string
          job_type: string
          requirements: string | null
          salary_currency: string | null
          salary_max: number | null
          salary_min: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          application_deadline?: string | null
          benefits?: string | null
          city: string
          company_name: string
          contact_email: string
          contact_phone?: string | null
          country: string
          created_at?: string
          id?: number
          job_description: string
          job_title: string
          job_type: string
          requirements?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          application_deadline?: string | null
          benefits?: string | null
          city?: string
          company_name?: string
          contact_email?: string
          contact_phone?: string | null
          country?: string
          created_at?: string
          id?: number
          job_description?: string
          job_title?: string
          job_type?: string
          requirements?: string | null
          salary_currency?: string | null
          salary_max?: number | null
          salary_min?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      player_islands: {
        Row: {
          aether: number
          created_at: string
          grid_height: number
          grid_width: number
          id: string
          level: number
          name: string
          ore: number
          steam: number
          updated_at: string
          user_id: string
        }
        Insert: {
          aether?: number
          created_at?: string
          grid_height?: number
          grid_width?: number
          id?: string
          level?: number
          name?: string
          ore?: number
          steam?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          aether?: number
          created_at?: string
          grid_height?: number
          grid_width?: number
          id?: string
          level?: number
          name?: string
          ore?: number
          steam?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          email: string | null
          home_country: string | null
          id: string
          name: string | null
          updated_at: string | null
        }
        Insert: {
          email?: string | null
          home_country?: string | null
          id: string
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          email?: string | null
          home_country?: string | null
          id?: string
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_skills_text: {
        Args: { skills_data: Json }
        Returns: string
      }
      requesting_user_id: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      search_cvs: {
        Args:
          | {
              role_filter?: string[]
              skill_filter?: string[]
              country_filter?: string[]
              search_query?: string
            }
          | {
              role_filter?: string[]
              skill_filter?: string[]
              country_filter?: string
              search_query?: string
            }
        Returns: {
          created_at: string
          education: Json[]
          gdpr_accepted: boolean | null
          gdpr_accepted_at: string | null
          id: string
          interested_roles: string[]
          languages: Json[]
          personal_info: Json
          search_text: unknown | null
          skills: Json | null
          status: string | null
          target_countries: string[]
          updated_at: string
          user_id: string
          work_experience: Json[]
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
