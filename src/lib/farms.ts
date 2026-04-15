import { supabase } from '@/lib/supabase'
import type { Farm } from '@/types'

// Shape returned from the farm_members join query when selecting related farms.
type FarmMemberRow = {
  farms: Farm[] | null
}

// Shape of the farm member data including profile info, returned from getFarmMembers.
type FarmMemberWithProfile = {
  user_id: string
  role: string
  profiles: {
    display_name: string | null
    avatar: string | null
  } | null
}

// Fetch all members for a given farm, including profile info.
export async function getFarmMembers(farmId: string): Promise<FarmMemberWithProfile[]> {
  const { data: members, error: membersError } = await supabase
    .from('farm_members')
    .select('user_id, role')
    .eq('farm_id', farmId)

  if (membersError) {
    throw membersError
  }

  const userIds = (members ?? []).map((member) => member.user_id)

  if (!userIds.length) {
    return []
  }

  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, display_name, avatar')
    .in('id', userIds)

  if (profilesError) {
    throw profilesError
  }

  const profileById = Object.fromEntries(
    (profiles ?? []).map((profile) => [
      profile.id,
      {
        display_name: profile.display_name,
        avatar: profile.avatar,
      },
    ]),
  )

  const missingProfileUserIds = userIds.filter((userId) => !profileById[userId])

  console.log('farm member count', members?.length ?? 0)
  console.log('profile count', profiles?.length ?? 0)
  console.log('missing profile user ids', missingProfileUserIds)
  console.log('raw members', members)

  return (members ?? []).map((member) => ({
    user_id: member.user_id,
    role: member.role,
    profiles: profileById[member.user_id] ?? null,
  }))
}

// Fetch farms the current user belongs to via the farm_members relationship.
export async function getMyFarms(): Promise<Farm[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('farm_members')
    .select(
      `
      farms (
        id,
        name,
        code,
        created_by,
        created_at
      )
    `,
    )
    .eq('user_id', user.id)

  if (error) {
    throw error
  }

  const rows = (data ?? []) as FarmMemberRow[]

  return rows.flatMap((row) => row.farms ?? [])
}

// Look up a farm using its join code.
export async function getFarmByCode(code: string) {
  const { data, error } = await supabase.from('farms').select('*').eq('code', code).maybeSingle()

  if (error) {
    throw error
  }

  return data
}
