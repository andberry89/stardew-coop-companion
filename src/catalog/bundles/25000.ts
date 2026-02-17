import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: '25000-gold-bundle',
  name: '25,000',
  room: 'vault',
  reward: 'Crystalarium (1)',
  rewardImg: 'crystalarium.png',
  bundleImg: '25000-gold-bundle.png',
  bundleIcon: 'bundle-purple.png',
  requiredCount: 1,
}

export const entries: BundleEntry[] = [
  { id: '25000-gold', bundleId: '25000-gold-bundle', itemId: '25000-gold' },
]
