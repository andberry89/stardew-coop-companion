import type { Bundle, BundleEntry } from '@/types'

export const bundle: Bundle = {
  id: 'night-fishing-bundle',
  name: 'Night Fishing',
  room: 'fish-tank',
  sortOrder: 4,
  reward: 'Glow Ring (1)',
  rewardImg: 'glow-ring.png',
  bundleImg: 'night-fishing-bundle.png',
  bundleIcon: 'bundle-purple.png',
  requiredCount: 3,
}

export const entries: BundleEntry[] = [
  { id: 'walleye', bundleId: 'night-fishing-bundle', itemId: 'walleye' },
  { id: 'bream', bundleId: 'night-fishing-bundle', itemId: 'bream' },
  { id: 'eel', bundleId: 'night-fishing-bundle', itemId: 'eel' },
]
