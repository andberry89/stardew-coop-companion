import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: 'lake-fish-bundle',
  name: 'Lake Fish',
  room: 'fish-tank',
  sortOrder: 2,
  reward: 'Dressed Spinner (1)',
  rewardImg: 'dressed-spinner.png',
  bundleImg: 'lake-fish-bundle.png',
  bundleIcon: 'bundle-green.png',
  requiredCount: 4,
}

export const entries: BundleEntry[] = [
  { id: 'largemouth-bass', bundleId: 'lake-fish-bundle', itemId: 'largemouth-bass' },
  { id: 'carp', bundleId: 'lake-fish-bundle', itemId: 'carp' },
  { id: 'bullhead', bundleId: 'lake-fish-bundle', itemId: 'bullhead' },
  { id: 'sturgeon', bundleId: 'lake-fish-bundle', itemId: 'sturgeon' },
]
