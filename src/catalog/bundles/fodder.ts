import type { Bundle, BundleEntry } from '@/types'

export const bundle: Bundle = {
  id: 'fodder-bundle',
  name: 'Fodder',
  room: 'bulletin-board',
  sortOrder: 4,
  reward: 'Heater (1)',
  rewardImg: 'heater.png',
  bundleImg: 'fodder-bundle.png',
  bundleIcon: 'bundle-yellow.png',
  requiredCount: 3,
}

export const entries: BundleEntry[] = [
  { id: 'wheat_10', bundleId: 'fodder-bundle', itemId: 'wheat', requiredPerSubmission: 10 },
  { id: 'hay_10', bundleId: 'fodder-bundle', itemId: 'hay', requiredPerSubmission: 10 },
  { id: 'apple_3', bundleId: 'fodder-bundle', itemId: 'apple', requiredPerSubmission: 3 },
]
