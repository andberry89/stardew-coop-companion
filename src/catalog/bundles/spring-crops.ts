import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: 'spring-crops-bundle',
  name: 'Spring Crops',
  room: 'pantry',
  reward: 'Speed-Gro (20)',
  rewardImg: 'speed-gro.png',
  bundleImg: 'spring-crops-bundle.png',
  bundleIcon: 'bundle-green.png',
  requiredCount: 4,
}

export const entries: BundleEntry[] = [
  { id: 'parsnip', bundleId: 'spring-crops-bundle', itemId: 'parsnip' },
  { id: 'green-bean', bundleId: 'spring-crops-bundle', itemId: 'green-bean' },
  { id: 'cauliflower', bundleId: 'spring-crops-bundle', itemId: 'cauliflower' },
  { id: 'potato', bundleId: 'spring-crops-bundle', itemId: 'potato' },
]
