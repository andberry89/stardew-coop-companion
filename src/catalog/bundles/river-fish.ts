import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: 'river-fish-bundle',
  name: 'River Fish',
  room: 'fish-tank',
  reward: 'Deluxe Bait (30)',
  rewardImg: 'deluxe-bait.png',
  bundleImg: 'river-fish-bundle.png',
  bundleIcon: 'bundle-teal.png',
  requiredCount: 4,
}

export const entries: BundleEntry[] = [
  { id: 'sunfish', bundleId: 'river-fish-bundle', itemId: 'sunfish' },
  { id: 'catfish', bundleId: 'river-fish-bundle', itemId: 'catfish' },
  { id: 'shad', bundleId: 'river-fish-bundle', itemId: 'shad' },
  { id: 'tiger-trout', bundleId: 'river-fish-bundle', itemId: 'tiger-trout' },
]
