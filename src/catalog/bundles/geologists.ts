import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: 'geologists-bundle',
  name: "Geologist's",
  room: 'boiler-room',
  sortOrder: 2,
  reward: 'Omni Geode (5)',
  rewardImg: 'omni-geode.png',
  bundleImg: 'geologists-bundle.png',
  bundleIcon: 'bundle-purple.png',
  requiredCount: 4,
}

export const entries: BundleEntry[] = [
  { id: 'quartz', bundleId: 'geologists-bundle', itemId: 'quartz' },
  { id: 'earth-crystal', bundleId: 'geologists-bundle', itemId: 'earth-crystal' },
  { id: 'frozen-tear', bundleId: 'geologists-bundle', itemId: 'frozen-tear' },
  { id: 'fire-quartz', bundleId: 'geologists-bundle', itemId: 'fire-quartz' },
]
