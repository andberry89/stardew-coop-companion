import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: 'blacksmith-bundle',
  name: "Blacksmith's Bundle",
  room: 'boiler-room',
  reward: 'furnace (1)',
  rewardImg: 'furnace.png',
  bundleImg: 'blacksmith-bundle.png',
  bundleIcon: 'bundle-orange.png',
  requiredCount: 3,
}

export const entries: BundleEntry[] = [
  { id: 'copper-bar', bundleId: 'blacksmith-bundle', itemId: 'copper-bar' },
  { id: 'iron-bar', bundleId: 'blacksmith-bundle', itemId: 'iron-bar' },
  { id: 'gold-bar', bundleId: 'blacksmith-bundle', itemId: 'gold-bar' },
]
