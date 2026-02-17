import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: '2500-gold-bundle',
  name: '2,500',
  room: 'vault',
  sortOrder: 1,
  reward: 'Chocolate Cake (3)',
  rewardImg: 'chocolate-cake.png',
  bundleImg: '2500-gold-bundle.png',
  bundleIcon: 'bundle-red.png',
  requiredCount: 1,
}

export const entries: BundleEntry[] = [
  { id: '2500-gold', bundleId: '2500-gold-bundle', itemId: '2500-gold' },
]
