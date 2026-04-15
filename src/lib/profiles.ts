import { supabase } from '@/lib/supabase'

// Profile fields stored for each authenticated user.
export type Profile = {
  display_name: string | null
  avatar: string | null
}

// Fetch the full profile record for a user.
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name, avatar')
    .eq('id', userId)
    .single()

  if (error) {
    throw error
  }

  return data
}

// Fetch multiple profiles by their user IDs.
export async function getProfilesByIds(userIds: string[]) {
  if (!userIds.length) {
    return []
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, avatar')
    .in('id', userIds)

  if (error) {
    throw error
  }

  return data ?? []
}

// Fetch only the avatar field for lightweight lookups.
export async function getProfileAvatar(userId: string): Promise<string | null> {
  const { data, error } = await supabase.from('profiles').select('avatar').eq('id', userId).single()

  if (error) {
    throw error
  }

  return data?.avatar ?? null
}

// Fetch only the display name for lightweight lookups.
export async function getProfileDisplayName(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', userId)
    .single()

  if (error) {
    throw error
  }

  return data?.display_name ?? null
}

// Update editable profile fields for the current user.
export async function updateProfile(
  userId: string,
  input: { display_name: string; avatar: string | null },
) {
  return supabase
    .from('profiles')
    .update({
      display_name: input.display_name,
      avatar: input.avatar,
    })
    .eq('id', userId)
}
