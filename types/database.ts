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
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          is_from_user: boolean
          message: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_from_user: boolean
          message: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_from_user?: boolean
          message?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_enrollments: {
        Row: {
          completed_at: string | null
          course_id: string
          enrolled_at: string | null
          id: string
          progress_percent: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          enrolled_at?: string | null
          id?: string
          progress_percent?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          enrolled_at?: string | null
          id?: string
          progress_percent?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      course_lessons: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_preview: boolean | null
          order_index: number
          title: string
          video_url: string | null
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean | null
          order_index?: number
          title: string
          video_url?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean | null
          order_index?: number
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          instructor_avatar: string | null
          instructor_name: string | null
          instructor_title: string | null
          is_free: boolean | null
          is_premium: boolean | null
          is_published: boolean | null
          level: string | null
          order_index: number | null
          price: number | null
          rating: number | null
          thumbnail_url: string | null
          title: string
          total_ratings: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          instructor_avatar?: string | null
          instructor_name?: string | null
          instructor_title?: string | null
          is_free?: boolean | null
          is_premium?: boolean | null
          is_published?: boolean | null
          level?: string | null
          order_index?: number | null
          price?: number | null
          rating?: number | null
          thumbnail_url?: string | null
          title: string
          total_ratings?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          instructor_avatar?: string | null
          instructor_name?: string | null
          instructor_title?: string | null
          is_free?: boolean | null
          is_premium?: boolean | null
          is_published?: boolean | null
          level?: string | null
          order_index?: number | null
          price?: number | null
          rating?: number | null
          thumbnail_url?: string | null
          title?: string
          total_ratings?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      daily_pearls: {
        Row: {
          author: string | null
          created_at: string | null
          id: string
          quote: string
          scheduled_date: string | null
        }
        Insert: {
          author?: string | null
          created_at?: string | null
          id?: string
          quote: string
          scheduled_date?: string | null
        }
        Update: {
          author?: string | null
          created_at?: string | null
          id?: string
          quote?: string
          scheduled_date?: string | null
        }
        Relationships: []
      }
      ebook_access: {
        Row: {
          ebook_id: string
          id: string
          purchased_at: string | null
          user_id: string
        }
        Insert: {
          ebook_id: string
          id?: string
          purchased_at?: string | null
          user_id: string
        }
        Update: {
          ebook_id?: string
          id?: string
          purchased_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ebook_access_ebook_id_fkey"
            columns: ["ebook_id"]
            isOneToOne: false
            referencedRelation: "ebooks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ebook_access_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ebook_progress: {
        Row: {
          current_page: number | null
          ebook_id: string
          id: string
          last_read_at: string | null
          user_id: string
        }
        Insert: {
          current_page?: number | null
          ebook_id: string
          id?: string
          last_read_at?: string | null
          user_id: string
        }
        Update: {
          current_page?: number | null
          ebook_id?: string
          id?: string
          last_read_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ebook_progress_ebook_id_fkey"
            columns: ["ebook_id"]
            isOneToOne: false
            referencedRelation: "ebooks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ebook_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ebooks: {
        Row: {
          author: string | null
          category: string | null
          cover_url: string | null
          created_at: string | null
          description: string | null
          file_type: string | null
          file_url: string
          id: string
          is_free: boolean | null
          is_premium: boolean | null
          is_published: boolean | null
          order_index: number | null
          price: number | null
          title: string
          total_pages: number | null
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          file_type?: string | null
          file_url: string
          id?: string
          is_free?: boolean | null
          is_premium?: boolean | null
          is_published?: boolean | null
          order_index?: number | null
          price?: number | null
          title: string
          total_pages?: number | null
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          category?: string | null
          cover_url?: string | null
          created_at?: string | null
          description?: string | null
          file_type?: string | null
          file_url?: string
          id?: string
          is_free?: boolean | null
          is_premium?: boolean | null
          is_published?: boolean | null
          order_index?: number | null
          price?: number | null
          title?: string
          total_pages?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      editorial_content: {
        Row: {
          content: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          is_locked: boolean | null
          is_published: boolean | null
          order_index: number | null
          published_at: string | null
          read_time_minutes: number | null
          title: string
          type: string | null
          updated_at: string | null
          video_duration: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_locked?: boolean | null
          is_published?: boolean | null
          order_index?: number | null
          published_at?: string | null
          read_time_minutes?: number | null
          title: string
          type?: string | null
          updated_at?: string | null
          video_duration?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          is_locked?: boolean | null
          is_published?: boolean | null
          order_index?: number | null
          published_at?: string | null
          read_time_minutes?: number | null
          title?: string
          type?: string | null
          updated_at?: string | null
          video_duration?: string | null
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          course_id: string
          id: string
          is_completed: boolean | null
          lesson_id: string
          updated_at: string | null
          user_id: string
          watched_seconds: number | null
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          id?: string
          is_completed?: boolean | null
          lesson_id: string
          updated_at?: string | null
          user_id: string
          watched_seconds?: number | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          id?: string
          is_completed?: boolean | null
          lesson_id?: string
          updated_at?: string | null
          user_id?: string
          watched_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lesson_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      Nao_mexa: {
        Row: {
          created_at: string | null
          id: number
          valor: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          valor: number
        }
        Update: {
          created_at?: string | null
          id?: number
          valor?: number
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          order_index: number | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          order_index?: number | null
          slug: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          order_index?: number | null
          slug?: string
        }
        Relationships: []
      }
      product_images: {
        Row: {
          created_at: string | null
          id: string
          image_url: string
          is_primary: boolean | null
          order_index: number | null
          product_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_url: string
          is_primary?: boolean | null
          order_index?: number | null
          product_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          image_url?: string
          is_primary?: boolean | null
          order_index?: number | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string | null
          description: string | null
          external_link: string
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          is_new: boolean | null
          name: string
          order_index: number | null
          price: number
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          external_link: string
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          name: string
          order_index?: number | null
          price: number
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          external_link?: string
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          is_new?: boolean | null
          name?: string
          order_index?: number | null
          price?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          is_admin: boolean | null
          is_vip: boolean | null
          member_since: string | null
          preferences: Json | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name: string
          id: string
          is_admin?: boolean | null
          is_vip?: boolean | null
          member_since?: string | null
          preferences?: Json | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          is_admin?: boolean | null
          is_vip?: boolean | null
          member_since?: string | null
          preferences?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      wishlist: {
        Row: {
          added_at: string | null
          id: string
          product_id: string
          user_id: string
        }
        Insert: {
          added_at?: string | null
          id?: string
          product_id: string
          user_id: string
        }
        Update: {
          added_at?: string | null
          id?: string
          product_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlist_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_app_user: {
        Args: { p_email: string; p_full_name?: string; p_password: string }
        Returns: Json
      }
      is_admin: { Args: never; Returns: boolean }
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

// Helper types for easier use
export type Profile = Tables<'profiles'>
export type Course = Tables<'courses'>
export type CourseLesson = Tables<'course_lessons'>
export type CourseEnrollment = Tables<'course_enrollments'>
export type LessonProgress = Tables<'lesson_progress'>
export type Ebook = Tables<'ebooks'>
export type EbookAccess = Tables<'ebook_access'>
export type EbookProgress = Tables<'ebook_progress'>
export type Product = Tables<'products'>
export type ProductCategory = Tables<'product_categories'>
export type ProductImage = Tables<'product_images'>
export type Wishlist = Tables<'wishlist'>
export type ChatMessage = Tables<'chat_messages'>
export type EditorialContent = Tables<'editorial_content'>
export type DailyPearl = Tables<'daily_pearls'>
