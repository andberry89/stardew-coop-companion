import { supabase } from '@/lib/supabase'
import { useBundlesStore } from '@/stores/bundles'

// Disconnect from the active farm session if one is currently connected.
export async function disconnectCurrentFarmIfNeeded() {
  const store = useBundlesStore()

  if (!store.currentFarmId) return

  await store.disconnectFromFarm()
}

// Ensure any active farm connection is closed before signing out.
export async function logoutWithFarmDisconnect() {
  await disconnectCurrentFarmIfNeeded()
  await supabase.auth.signOut()
}
