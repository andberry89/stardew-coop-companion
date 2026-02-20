import { supabase } from './supabase'

export async function signInWithEmail(email: string) {
  return supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: 'http://localhost:5173',
    },
  })
}

export async function signOut() {
  return supabase.auth.signOut()
}
