import { supabase } from '@/lib/supabase'
import type { Farm } from '@/types'

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

  return (data ?? []).map((row) => row.farms).filter((farm): farm is Farm => !!farm)
}

export async function getFarmByCode(code: string) {
  const { data, error } = await supabase.from('farms').select('*').eq('code', code).single()

  if (error) return null
  return data
}
