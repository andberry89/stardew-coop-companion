import type { Bundle, BundleEntry } from '@/types'

export const bundle: Bundle = {
  id: '10000-gold-bundle',
  name: '10,000',
  room: 'vault',
  sortOrder: 3,
  reward: 'Lightning Rod (1)',
  rewardImg: 'lightning-rod.png',
  bundleImg: '10000-gold-bundle.png',
  bundleIcon: 'bundle-yellow.png',
  requiredCount: 1,
}

export const entries: BundleEntry[] = [
  { id: '10000-gold', bundleId: '10000-gold-bundle', itemId: '10000-gold' },
]
