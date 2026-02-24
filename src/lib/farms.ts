import { supabase } from '@/lib/supabase'

export type Farm = {
  id: string
  name: string
  code: string
  created_by: string
  created_at: string
}

export async function getMyFarms(): Promise<Farm[]> {
  const { data, error } = await supabase
    .from('farms')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data ?? []
}
