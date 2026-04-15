// Farm record stored in the database and used throughout the app.
export type Farm = {
  id: string
  name: string
  code: string
  created_by: string
  created_at: string
}

// Connection lifecycle states used by the farm realtime/session system.
export type FarmConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'reconnecting'
  | 'full'
  | 'error'

// Minimal farm data stored in UI state when a farm is selected.
export type SelectedFarm = Pick<Farm, 'id' | 'name' | 'code'>

// Farm status data received from the server in realtime while connected to a farm session.
export type ActiveFarmPlayer = {
  id: string
  displayName: string
  avatar: string | null
}
