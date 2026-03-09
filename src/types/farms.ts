export type Farm = {
  id: string
  name: string
  code: string
  created_by: string
  created_at: string
}

export type FarmConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'full'
  | 'error'

export type SelectedFarm = Pick<Farm, 'id' | 'name' | 'code'>
