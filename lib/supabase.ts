import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          image: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          image?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          image?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      travel_dates: {
        Row: {
          id: string
          date: string
          capacity: number
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          date: string
          capacity?: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          date?: string
          capacity?: number
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      participants: {
        Row: {
          id: string
          travel_date_id: string
          user_id: string
          name: string
          phone: string
          flight: string
          flight_code: string
          departure_time: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          travel_date_id: string
          user_id: string
          name: string
          phone: string
          flight: string
          flight_code: string
          departure_time: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          travel_date_id?: string
          user_id?: string
          name?: string
          phone?: string
          flight?: string
          flight_code?: string
          departure_time?: string
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
