import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: 'fall-foraging-bundle',
  name: 'Fall Foraging',
  room: 'crafts-room',
  sortOrder: 3,
  reward: 'Fall Seeds (30)',
  rewardImg: 'fall-seeds.png',
  bundleImg: 'fall-foraging-bundle.png',
  bundleIcon: 'bundle-orange.png',
  requiredCount: 4,
}

export const entries: BundleEntry[] = [
  { id: 'common-mushroom', bundleId: 'fall-foraging-bundle', itemId: 'common-mushroom' },
  { id: 'wild-plum', bundleId: 'fall-foraging-bundle', itemId: 'wild-plum' },
  { id: 'hazelnut', bundleId: 'fall-foraging-bundle', itemId: 'hazelnut' },
  { id: 'blackberry', bundleId: 'fall-foraging-bundle', itemId: 'blackberry' },
]
