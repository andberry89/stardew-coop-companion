import type { Bundle, BundleEntry } from '@/types/bundles'

export const bundle: Bundle = {
  id: 'summer-foraging-bundle',
  name: 'Summer Foraging Bundle',
  room: 'crafts-room',
  reward: 'Summer Seeds (30)',
  rewardImg: 'summer-seeds.png',
  bundleImg: 'summer-foraging-bundle.png',
  bundleIcon: 'bundle-yellow.png',
  requiredCount: 3,
}

export const entries: BundleEntry[] = [
  { id: 'grape', bundleId: 'summer-foraging-bundle', itemId: 'grape' },
  { id: 'spice-berry', bundleId: 'summer-foraging-bundle', itemId: 'spice-berry' },
  { id: 'sweet-pea', bundleId: 'summer-foraging-bundle', itemId: 'sweet-pea' },
]
