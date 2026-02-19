import type { Bundle, BundleEntry } from '@/types'

export const bundle: Bundle = {
  id: 'chefs-bundle',
  name: "Chef's",
  room: 'bulletin-board',
  sortOrder: 1,
  reward: 'Pink Cake (3)',
  rewardImg: 'pink-cake.png',
  bundleImg: 'chefs-bundle.png',
  bundleIcon: 'bundle-red.png',
  requiredCount: 6,
}

export const entries: BundleEntry[] = [
  { id: 'maple-syrup', bundleId: 'chefs-bundle', itemId: 'maple-syrup' },
  { id: 'fiddlehead-fern', bundleId: 'chefs-bundle', itemId: 'fiddlehead-fern' },
  { id: 'truffle', bundleId: 'chefs-bundle', itemId: 'truffle' },
  { id: 'poppy', bundleId: 'chefs-bundle', itemId: 'poppy' },
  { id: 'maki-roll', bundleId: 'chefs-bundle', itemId: 'maki-roll' },
  { id: 'fried-egg', bundleId: 'chefs-bundle', itemId: 'fried-egg' },
]
