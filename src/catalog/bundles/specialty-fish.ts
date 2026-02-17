import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: 'specialty-fish-bundle',
  name: 'Specialty Fish',
  room: 'fish-tank',
  reward: "Dish O' the Sea (5)",
  rewardImg: 'dish-o-the-sea.png',
  bundleImg: 'specialty-fish-bundle.png',
  bundleIcon: 'bundle-red.png',
  requiredCount: 4,
}

export const entries: BundleEntry[] = [
  { id: 'pufferfish', bundleId: 'specialty-fish-bundle', itemId: 'pufferfish' },
  { id: 'ghostfish', bundleId: 'specialty-fish-bundle', itemId: 'ghostfish' },
  { id: 'sandfish', bundleId: 'specialty-fish-bundle', itemId: 'sandfish' },
  { id: 'woodskip', bundleId: 'specialty-fish-bundle', itemId: 'woodskip' },
]
