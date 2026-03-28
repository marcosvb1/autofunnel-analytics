export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
          settings: Json
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
          settings?: Json
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
          settings?: Json
        }
      }
      integrations: {
        Row: {
          id: string
          project_id: string
          type: 'posthog' | 'meta_ads' | 'google_ads'
          credentials: Json
          status: 'connected' | 'disconnected' | 'error'
          last_sync_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          type: 'posthog' | 'meta_ads' | 'google_ads'
          credentials: Json
          status?: 'connected' | 'disconnected' | 'error'
          last_sync_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          type?: 'posthog' | 'meta_ads' | 'google_ads'
          credentials?: Json
          status?: 'connected' | 'disconnected' | 'error'
          last_sync_at?: string | null
          created_at?: string
        }
      }
      funnel_maps: {
        Row: {
          id: string
          project_id: string
          name: string
          nodes: Json[]
          edges: Json[]
          metadata: Json
          is_auto_generated: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          nodes?: Json[]
          edges?: Json[]
          metadata?: Json
          is_auto_generated?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          nodes?: Json[]
          edges?: Json[]
          metadata?: Json
          is_auto_generated?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      sync_logs: {
        Row: {
          id: string
          project_id: string
          type: string
          status: 'success' | 'error' | 'pending'
          error_message: string | null
          records_processed: number
          started_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          project_id: string
          type: string
          status: 'success' | 'error' | 'pending'
          error_message?: string | null
          records_processed?: number
          started_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string
          type?: string
          status?: 'success' | 'error' | 'pending'
          error_message?: string | null
          records_processed?: number
          started_at?: string
          completed_at?: string | null
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']

export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']