import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Generation = {
  id: string
  user_id: string
  prompt: string
  original_image_url?: string
  generated_image_url?: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export type Profile = {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  credits: number
  created_at: string
  updated_at: string
}