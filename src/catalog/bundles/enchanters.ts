import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: 'enchanters-bundle',
  name: "Enchanter's",
  room: 'bulletin-board',
  reward: 'Gold Bar (5)',
  rewardImg: 'gold-bar.png',
  bundleImg: 'enchanters-bundle.png',
  bundleIcon: 'bundle-purple.png',
  requiredCount: 4,
}

export const entries: BundleEntry[] = [
  { id: 'oak-resin', bundleId: 'enchanters-bundle', itemId: 'oak-resin' },
  { id: 'wine', bundleId: 'enchanters-bundle', itemId: 'wine' },
  { id: 'rabbits-foot', bundleId: 'enchanters-bundle', itemId: 'rabbits-foot' },
  { id: 'pomegranate', bundleId: 'enchanters-bundle', itemId: 'pomegranate' },
]
