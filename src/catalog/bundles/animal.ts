import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: 'animal-bundle',
  name: 'Animal',
  room: 'pantry',
  reward: 'Cheese Press (1)',
  rewardImg: 'cheese-press.png',
  bundleImg: 'animal-bundle.png',
  bundleIcon: 'bundle-red.png',
  requiredCount: 5,
}

export const entries: BundleEntry[] = [
  { id: 'large-milk', bundleId: 'animal-bundle', itemId: 'large-milk' },
  { id: 'large-brown-egg', bundleId: 'animal-bundle', itemId: 'large-brown-egg' },
  { id: 'large-white-egg', bundleId: 'animal-bundle', itemId: 'large-white-egg' },
  { id: 'large-goat-milk', bundleId: 'animal-bundle', itemId: 'large-goat-milk' },
  { id: 'wool', bundleId: 'animal-bundle', itemId: 'wool' },
  { id: 'duck-egg', bundleId: 'animal-bundle', itemId: 'duck-egg' },
]
