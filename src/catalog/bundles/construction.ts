import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: 'construction-bundle',
  name: 'Construction Bundle',
  room: 'crafts-room',
  reward: 'Charcoal Kiln (1)',
  rewardImg: 'charcoal-kiln.png',
  bundleImg: 'construction-bundle.png',
  bundleIcon: 'bundle-red.png',
  requiredCount: 4,
}

export const entries: BundleEntry[] = [
  {
    id: 'wood_99_a',
    bundleId: 'construction-bundle',
    itemId: 'wood',
    requiredPerSubmission: 99,
  },
  {
    id: 'wood_99_b',
    bundleId: 'construction-bundle',
    itemId: 'wood',
    requiredPerSubmission: 99,
  },
  {
    id: 'stone_99',
    bundleId: 'construction-bundle',
    itemId: 'stone',
    requiredPerSubmission: 99,
  },
  {
    id: 'hardwood_10',
    bundleId: 'construction-bundle',
    itemId: 'hardwood',
    requiredPerSubmission: 10,
  },
]
