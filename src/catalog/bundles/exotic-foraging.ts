import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: 'exotic-foraging-bundle',
  name: 'Exotic Foraging Bundle',
  room: 'crafts-room',
  reward: "Autumn's Bounty (5)",
  rewardImg: 'autumns-bounty.png',
  bundleImg: 'exotic-foraging-bundle.png',
  bundleIcon: 'bundle-purple.png',
  requiredCount: 5,
}

export const entries: BundleEntry[] = [
  { id: 'coconut', bundleId: 'exotic-foraging-bundle', itemId: 'coconut' },
  { id: 'cactus-fruit', bundleId: 'exotic-foraging-bundle', itemId: 'cactus-fruit' },
  { id: 'cave-carrot', bundleId: 'exotic-foraging-bundle', itemId: 'cave-carrot' },
  { id: 'red-mushroom', bundleId: 'exotic-foraging-bundle', itemId: 'red-mushroom' },
  { id: 'purple-mushroom', bundleId: 'exotic-foraging-bundle', itemId: 'purple-mushroom' },
  { id: 'maple-syrup', bundleId: 'exotic-foraging-bundle', itemId: 'maple-syrup' },
  { id: 'oak-resin', bundleId: 'exotic-foraging-bundle', itemId: 'oak-resin' },
  { id: 'pine-tar', bundleId: 'exotic-foraging-bundle', itemId: 'pine-tar' },
  { id: 'morel', bundleId: 'exotic-foraging-bundle', itemId: 'morel' },
]
