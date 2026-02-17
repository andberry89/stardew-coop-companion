import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: 'adventurers-bundle',
  name: "Adventurer's",
  room: 'boiler-room',
  sortOrder: 3,
  reward: 'Small Magnet Ring (1)',
  rewardImg: 'small-magnet-ring.png',
  bundleImg: 'adventurers-bundle.png',
  bundleIcon: 'bundle-purple.png',
  requiredCount: 2,
}

export const entries: BundleEntry[] = [
  { id: 'slime_99', bundleId: 'adventurers-bundle', itemId: 'slime', requiredPerSubmission: 99 },
  {
    id: 'bat-wing_10',
    bundleId: 'adventurers-bundle',
    itemId: 'bat-wing',
    requiredPerSubmission: 10,
  },
  { id: 'solar-essence', bundleId: 'adventurers-bundle', itemId: 'solar-essence' },
  { id: 'void-essence', bundleId: 'adventurers-bundle', itemId: 'void-essence' },
]
