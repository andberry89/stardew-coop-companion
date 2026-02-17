import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: 'crab-pot-bundle',
  name: 'Crab Pot',
  room: 'fish-tank',
  sortOrder: 5,
  reward: 'Crab Pot (3)',
  rewardImg: 'crab-pot.png',
  bundleImg: 'crab-pot-bundle.png',
  bundleIcon: 'bundle-purple.png',
  requiredCount: 5,
}

export const entries: BundleEntry[] = [
  { id: 'lobster', bundleId: 'crab-pot-bundle', itemId: 'lobster' },
  { id: 'crayfish', bundleId: 'crab-pot-bundle', itemId: 'crayfish' },
  { id: 'crab', bundleId: 'crab-pot-bundle', itemId: 'crab' },
  { id: 'cockle', bundleId: 'crab-pot-bundle', itemId: 'cockle' },
  { id: 'mussel', bundleId: 'crab-pot-bundle', itemId: 'mussel' },
  { id: 'shrimp', bundleId: 'crab-pot-bundle', itemId: 'shrimp' },
  { id: 'snail', bundleId: 'crab-pot-bundle', itemId: 'snail' },
  { id: 'periwinkle', bundleId: 'crab-pot-bundle', itemId: 'periwinkle' },
  { id: 'oyster', bundleId: 'crab-pot-bundle', itemId: 'oyster' },
  { id: 'clam', bundleId: 'crab-pot-bundle', itemId: 'clam' },
]
