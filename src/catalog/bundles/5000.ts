import type { Bundle, BundleEntry } from '@/types'

export const bundle: Bundle = {
  id: '5000-gold-bundle',
  name: '5,000',
  room: 'vault',
  sortOrder: 2,
  reward: 'Quality Fertilizer (30)',
  rewardImg: 'quality-fertilizer.png',
  bundleImg: '5000-gold-bundle.png',
  bundleIcon: 'bundle-orange.png',
  requiredCount: 1,
}

export const entries: BundleEntry[] = [
  { id: '5000-gold', bundleId: '5000-gold-bundle', itemId: '5000-gold' },
]
