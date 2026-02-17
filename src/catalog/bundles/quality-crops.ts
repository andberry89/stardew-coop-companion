import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: 'quality-crops-bundle',
  name: 'Quality Crops',
  room: 'pantry',
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
    requiredPerSubmisssion: 5,
    minQuality: 'gold',
  },
  {
    id: 'melon_gold_5',
    bundleId: 'quality-crops-bundle',
    itemId: 'melon',
    requiredPerSubmisssion: 5,
    minQuality: 'gold',
  },
  {
    id: 'pumpkin_gold_5',
    bundleId: 'quality-crops-bundle',
    itemId: 'pumpkin',
    requiredPerSubmisssion: 5,
    minQuality: 'gold',
  },
  {
    id: 'corn_gold_5',
    bundleId: 'quality-crops-bundle',
    itemId: 'corn',
    requiredPerSubmisssion: 5,
    minQuality: 'gold',
  },
]
