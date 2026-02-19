import type { Bundle, BundleEntry } from '@/types'

export const bundle: Bundle = {
  id: 'fall-crops-bundle',
  name: 'Fall Crops',
  room: 'pantry',
  sortOrder: 3,
  reward: 'Bee House (1)',
  rewardImg: 'bee-house.png',
  bundleImg: 'fall-crops-bundle.png',
  bundleIcon: 'bundle-orange.png',
  requiredCount: 4,
}

export const entries: BundleEntry[] = [
  { id: 'corn', bundleId: 'fall-crops-bundle', itemId: 'corn' },
  { id: 'eggplant', bundleId: 'fall-crops-bundle', itemId: 'eggplant' },
  { id: 'pumpkin', bundleId: 'fall-crops-bundle', itemId: 'pumpkin' },
  { id: 'yam', bundleId: 'fall-crops-bundle', itemId: 'yam' },
]
