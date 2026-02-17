import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: 'field-research-bundle',
  name: 'Field Research',
  room: 'bulletin-board',
  reward: 'Recycling Machine (1)',
  rewardImg: 'recycling-machine.png',
  bundleImg: 'field-research-bundle.png',
  bundleIcon: 'bundle-blue.png',
  requiredCount: 4,
}

export const entries: BundleEntry[] = [
  { id: 'purple-mushroom', bundleId: 'field-research-bundle', itemId: 'purple-mushroom' },
  { id: 'nautilus-shell', bundleId: 'field-research-bundle', itemId: 'nautilus-shell' },
  { id: 'chub', bundleId: 'field-research-bundle', itemId: 'chub' },
  { id: 'frozen-tear', bundleId: 'field-research-bundle', itemId: 'frozen-tear' },
]
