import { createClient } from '@supabase/supabase-js'
import { supabaseAnonKey, supabaseUrl } from './config'

// Initialize the Supabase client using environment variables
// configured for the current deployment environment.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
