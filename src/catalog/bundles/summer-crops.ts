import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: 'summer-crops-bundle',
  name: 'Summer Crops',
  room: 'pantry',
  reward: 'Quality Sprinkler (1)',
  rewardImg: 'quality-sprinkler.png',
  bundleImg: 'summer-crops-bundle.png',
  bundleIcon: 'bundle-yellow.png',
  requiredCount: 4,
}

export const entries: BundleEntry[] = [
  { id: 'tomato', bundleId: 'summer-crops-bundle', itemId: 'tomato' },
  { id: 'hot-pepper', bundleId: 'summer-crops-bundle', itemId: 'hot-pepper' },
  { id: 'blueberry', bundleId: 'summer-crops-bundle', itemId: 'blueberry' },
  { id: 'melon', bundleId: 'summer-crops-bundle', itemId: 'melon' },
]
