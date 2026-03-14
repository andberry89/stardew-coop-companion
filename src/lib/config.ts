const { VITE_APP_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } = import.meta.env

export const appUrl = VITE_APP_URL
export const loginUrl = `${VITE_APP_URL}/login`
export const supabaseUrl = VITE_SUPABASE_URL
export const supabaseAnonKey = VITE_SUPABASE_ANON_KEY
