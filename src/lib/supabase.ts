import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client using environment variables
// configured for the current deployment environment.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)
