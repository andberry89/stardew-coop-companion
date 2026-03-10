import { supabase } from '@/lib/supabase'
import type { Farm } from '@/types'

type FarmMemberRow = {
  farms: Farm[] | null
}

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

  return rows.flatMap((row) => row.farms ?? [])
}

export async function getFarmByCode(code: string) {
  const { data, error } = await supabase.from('farms').select('*').eq('code', code).maybeSingle()

  if (error) {
    throw error
  }

  return data
}
