import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: '10000-gold-bundle',
  name: '10,000 Bundle',
  room: 'vault',
  reward: 'Lightning Rod (1)',
  rewardImg: 'lightning-rod.png',
  bundleImg: '10000-gold-bundle.png',
  bundleIcon: 'bundle-yellow.png',
  requiredCount: 1,
}

export const entries: BundleEntry[] = [
  { id: '10000-gold', bundleId: '10000-gold-bundle', itemId: '10000-gold' },
]
