import { supabase } from '@/lib/supabase'

export type Profile = {
  display_name: string | null
  avatar: string | null
}

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

export async function getProfileAvatar(userId: string): Promise<string | null> {
  const { data, error } = await supabase.from('profiles').select('avatar').eq('id', userId).single()

  if (error) {
    throw error
  }

  return data?.avatar ?? null
}

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
