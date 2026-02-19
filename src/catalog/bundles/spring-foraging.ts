import type { Bundle, BundleEntry } from '@/types'

export const bundle: Bundle = {
  id: 'spring-foraging-bundle',
  name: 'Spring Foraging',
  room: 'crafts-room',
  sortOrder: 1,
  reward: 'Spring Seeds (30)',
  rewardImg: 'spring-seeds.png',
  bundleImg: 'spring-foraging-bundle.png',
  bundleIcon: 'bundle-green.png',
  requiredCount: 4,
}

export const entries: BundleEntry[] = [
  { id: 'wild-horseradish', bundleId: 'spring-foraging-bundle', itemId: 'wild-horseradish' },
  { id: 'daffodil', bundleId: 'spring-foraging-bundle', itemId: 'daffodil' },
  { id: 'leek', bundleId: 'spring-foraging-bundle', itemId: 'leek' },
  { id: 'dandelion', bundleId: 'spring-foraging-bundle', itemId: 'dandelion' },
]
