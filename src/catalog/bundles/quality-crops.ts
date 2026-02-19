import type { Bundle, BundleEntry } from '@/types'

export const bundle: Bundle = {
  id: 'quality-crops-bundle',
  name: 'Quality Crops',
  room: 'pantry',
  sortOrder: 4,
  reward: 'Preserve Jar (1)',
  rewardImg: 'preserves-jar.png',
  bundleImg: 'quality-crops-bundle.png',
  bundleIcon: 'bundle-teal.png',
  requiredCount: 3,
}

export const entries: BundleEntry[] = [
  {
    id: 'parsnip_gold_5',
    bundleId: 'quality-crops-bundle',
    itemId: 'parsnip',
    requiredPerSubmission: 5,
    minQuality: 'gold',
  },
  {
    id: 'melon_gold_5',
    bundleId: 'quality-crops-bundle',
    itemId: 'melon',
    requiredPerSubmission: 5,
    minQuality: 'gold',
  },
  {
    id: 'pumpkin_gold_5',
    bundleId: 'quality-crops-bundle',
    itemId: 'pumpkin',
    requiredPerSubmission: 5,
    minQuality: 'gold',
  },
  {
    id: 'corn_gold_5',
    bundleId: 'quality-crops-bundle',
    itemId: 'corn',
    requiredPerSubmission: 5,
    minQuality: 'gold',
  },
]
