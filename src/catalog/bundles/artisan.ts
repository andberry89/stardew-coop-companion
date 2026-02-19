import type { Bundle, BundleEntry } from '@/types'

export const bundle: Bundle = {
  id: 'artisan-bundle',
  name: 'Artisan',
  room: 'pantry',
  sortOrder: 6,
  reward: 'Keg (1)',
  rewardImg: 'keg.png',
  bundleImg: 'artisan-bundle.png',
  bundleIcon: 'bundle-purple.png',
  requiredCount: 6,
}

export const entries: BundleEntry[] = [
  { id: 'truffle-oil', bundleId: 'artisan-bundle', itemId: 'truffle-oil' },
  { id: 'cloth', bundleId: 'artisan-bundle', itemId: 'cloth' },
  { id: 'goat-cheese', bundleId: 'artisan-bundle', itemId: 'goat-cheese' },
  { id: 'cheese', bundleId: 'artisan-bundle', itemId: 'cheese' },
  { id: 'honey', bundleId: 'artisan-bundle', itemId: 'honey' },
  { id: 'jelly', bundleId: 'artisan-bundle', itemId: 'jelly' },
  { id: 'apple', bundleId: 'artisan-bundle', itemId: 'apple' },
  { id: 'apricot', bundleId: 'artisan-bundle', itemId: 'apricot' },
  { id: 'orange', bundleId: 'artisan-bundle', itemId: 'orange' },
  { id: 'peach', bundleId: 'artisan-bundle', itemId: 'peach' },
  { id: 'pomegranate', bundleId: 'artisan-bundle', itemId: 'pomegranate' },
  { id: 'cherry', bundleId: 'artisan-bundle', itemId: 'cherry' },
]
