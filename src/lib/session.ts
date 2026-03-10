import { supabase } from '@/lib/supabase'
import { useBundlesStore } from '@/stores/bundles'

export async function disconnectCurrentFarmIfNeeded() {
  const store = useBundlesStore()

  if (!store.currentFarmId) return

  await store.disconnectFromFarm()
}

export async function logoutWithFarmDisconnect() {
  await disconnectCurrentFarmIfNeeded()
  await supabase.auth.signOut()
}
