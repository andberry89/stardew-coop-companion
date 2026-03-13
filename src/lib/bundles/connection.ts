import { supabase } from '@/lib/supabase'
import type { FarmConnectionStatus } from '@/types'

// ─────────────────────────────
// Seat Management
// ─────────────────────────────

export async function claimFarmSeat(farmId: string) {
  // Claim an active seat for this farm through the database RPC,
  // which enforces farm capacity on the backend.
  return await supabase.rpc('claim_seat', {
    input_farm_id: farmId,
  })
}

// ─────────────────────────────
// Session Presence
// ─────────────────────────────

export async function removeFarmSession(farmId: string, userId: string) {
  return await supabase.from('farm_sessions').delete().match({
    farm_id: farmId,
    user_id: userId,
  })
}

export async function fetchFarmSessionUserIds(farmId: string): Promise<string[]> {
  const { data } = await supabase.from('farm_sessions').select('user_id').eq('farm_id', farmId)

  return data?.map((row) => row.user_id) ?? []
}

export function createFarmSessionsChannel(
  farmId: string,
  handlers: {
    onSessionUsersChange: (userIds: string[]) => void
  },
) {
  // Re-fetch the full active user list after any session change so the
  // app always reflects the latest connected users for this farm.
  const refresh = async () => {
    const userIds = await fetchFarmSessionUserIds(farmId)
    handlers.onSessionUsersChange(userIds)
  }

  const channel = supabase
    .channel(`farm-sessions-${farmId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'farm_sessions',
        filter: `farm_id=eq.${farmId}`,
      },
      async () => {
        await refresh()
      },
    )
    .subscribe()

  // Hydrate active users immediately instead of waiting
  // for the first realtime session event.
  void refresh()

  return () => {
    supabase.removeChannel(channel)
  }
}

// ─────────────────────────────
// Farm State Realtime
// ─────────────────────────────

export function createFarmStateChannel(
  farmId: string,
  handlers: {
    onStateUpdate: (entries: Record<string, unknown>) => void
    onStatusChange: (status: FarmConnectionStatus) => void
  },
) {
  // Subscribe to realtime updates for this farm's state row and translate
  // Supabase channel events into the app's farm connection status.
  const channel = supabase
    .channel(`farm-${farmId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'farm_state',
        filter: `farm_id=eq.${farmId}`,
      },
      (payload) => {
        // farm_state rows store tracked progress under state.entries.
        const next = payload.new as { state?: { entries?: Record<string, unknown> } }
        const entries = next.state?.entries ?? {}

        handlers.onStateUpdate(entries)
      },
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        handlers.onStatusChange('connected')
      }

      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
        handlers.onStatusChange('reconnecting')
      }
    })

  return () => {
    supabase.removeChannel(channel)
  }
}
