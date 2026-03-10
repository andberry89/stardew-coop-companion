import { supabase } from './supabase'

const PASSWORD_MIN_LENGTH = 8

export function getPasswordValidationMessage(password: string): string | null {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return 'Password must be at least 8 characters.'
  }

  if (!/[A-Za-z]/.test(password)) {
    return 'Password must include a letter.'
  }

  if (!/\d/.test(password)) {
    return 'Password must include a number.'
  }

  return null
}

export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${window.location.origin}/login`,
    },
  })
}

export async function signIn(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function requestPasswordReset(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/login?mode=reset`,
  })
}

export async function updatePassword(password: string) {
  return supabase.auth.updateUser({
    password,
  })
}

export async function deleteAccount() {
  return supabase.functions.invoke('delete-account', {
    body: {},
  })
}
