import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: 'dye-bundle',
  name: 'Dye Bundle',
  room: 'bulletin-board',
  reward: 'Seed Maker (1)',
  rewardImg: 'seed-maker.png',
  bundleImg: 'dye-bundle.png',
  bundleIcon: 'bundle-teal.png',
  requiredCount: 6,
}

export const entries: BundleEntry[] = [
  { id: 'red-mushroom', bundleId: 'dye-bundle', itemId: 'red-mushroom' },
  { id: 'sea-urchin', bundleId: 'dye-bundle', itemId: 'sea-urchin' },
  { id: 'sunflower', bundleId: 'dye-bundle', itemId: 'sunflower' },
  { id: 'duck-feather', bundleId: 'dye-bundle', itemId: 'duck-feather' },
  { id: 'aquamarine', bundleId: 'dye-bundle', itemId: 'aquamarine' },
  { id: 'red-cabbage', bundleId: 'dye-bundle', itemId: 'red-cabbage' },
]
