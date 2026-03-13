import { supabase } from '@/lib/supabase'
import type { Farm } from '@/types'

// Shape returned from the farm_members join query when selecting related farms.
type FarmMemberRow = {
  farms: Farm[] | null
}

// Fetch farms the current user belongs to via the farm_members relationship.
export async function getMyFarms(): Promise<Farm[]> {
  const { data, error } = await supabase.from('farm_members').select(`
      farms (
        id,
        name,
        code,
        created_by,
        created_at
      )
    `)

  if (error) throw error

  const rows = (data ?? []) as FarmMemberRow[]

  // Flatten the joined rows into a simple farm list.
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
