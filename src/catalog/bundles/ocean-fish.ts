import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: 'ocean-fish-bundle',
  name: 'Ocean Fish',
  room: 'fish-tank',
  reward: 'Warp Totem: Beach (5)',
  rewardImg: 'warp-totem-beach.png',
  bundleImg: 'ocean-fish-bundle.png',
  bundleIcon: 'bundle-blue.png',
  requiredCount: 4,
}

export const entries: BundleEntry[] = [
  { id: 'sardine', bundleId: 'ocean-fish-bundle', itemId: 'sardine' },
  { id: 'tuna', bundleId: 'ocean-fish-bundle', itemId: 'tuna' },
  { id: 'red-snapper', bundleId: 'ocean-fish-bundle', itemId: 'red-snapper' },
  { id: 'tilapia', bundleId: 'ocean-fish-bundle', itemId: 'tilapia' },
]
