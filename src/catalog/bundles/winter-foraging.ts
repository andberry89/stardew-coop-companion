import type { Bundle, BundleEntry } from '@/types'

export const bundle: Bundle = {
  id: 'winter-foraging-bundle',
  name: 'Winter Foraging',
  room: 'crafts-room',
  sortOrder: 4,
  reward: 'Winter Seeds (30)',
  rewardImg: 'winter-seeds.png',
  bundleImg: 'winter-foraging-bundle.png',
  bundleIcon: 'bundle-teal.png',
  requiredCount: 4,
}

export const entries: BundleEntry[] = [
  { id: 'winter-root', bundleId: 'winter-foraging-bundle', itemId: 'winter-root' },
  { id: 'crystal-fruit', bundleId: 'winter-foraging-bundle', itemId: 'crystal-fruit' },
  { id: 'snow-yam', bundleId: 'winter-foraging-bundle', itemId: 'snow-yam' },
  { id: 'crocus', bundleId: 'winter-foraging-bundle', itemId: 'crocus' },
]
