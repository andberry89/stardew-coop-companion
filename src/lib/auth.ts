import { loginUrl } from './config'
import { supabase } from './supabase'

// Password rules enforced during account creation.
const PASSWORD_MIN_LENGTH = 8

// Validate password strength before sending it to Supabase during signup.
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

// Create a new account and redirect the email verification link
// back to the login page after confirmation.
export async function signUp(email: string, password: string) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: loginUrl,
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

// Send a password reset email that returns the user to the login page
// in reset mode so they can choose a new password.
export async function requestPasswordReset(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: loginUrl,
  })
}

// Update the authenticated user's password after completing the
// password recovery flow.
export async function updatePassword(password: string) {
  return supabase.auth.updateUser({
    password,
  })
}

// Delete the current user account via a Supabase edge function.
// This handles cleanup that cannot be performed from the client.
export async function deleteAccount() {
  return supabase.functions.invoke('delete-account', {
    body: {},
  })
}
