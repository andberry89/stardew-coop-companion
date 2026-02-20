import type { RoomId, Room } from '@/types/rooms'

/* ---------------------------------- */
/* Core Enums */
/* ---------------------------------- */

export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'any'

export type ItemType =
  | 'animal'
  | 'artisan'
  | 'cooking'
  | 'crop'
  | 'fish'
  | 'forage'
  | 'mining'
  | 'other'
  | 'resource'

export type Quality = 'normal' | 'silver' | 'gold' | 'iridium'

/* ---------------------------------- */
/* Core Domain Models */
/* ---------------------------------- */

export type Item = {
  id: string
  name: string
  type: ItemType
  seasons: Season[]
  sources: string[]
  notes?: string
}

export type Bundle = {
  id: string
  name: string
  room: RoomId
  sortOrder: number
  reward: string
  rewardImg: string
  requiredCount: number
  bundleImg: string
  bundleIcon: string
}

export type BundleEntry = {
  id: string
  bundleId: string
  itemId: string
  requiredPerSubmission?: number
  minQuality?: Quality
  notes?: string
}

export type BundleEntry = SingleItemEntry | OptionItemEntry

/* ---------------------------------- */
/* View Models */
/* ---------------------------------- */

export type BundleItem = {
  entryKey: string
  entry: BundleEntry
  completed: boolean
  item?: Item
  options?: Item[]
}

/* ---------------------------------- */
/* Progress Models */
/* ---------------------------------- */

export type BundleProgress = {
  completed: number
  required: number
  isComplete: boolean
}

export type RoomProgress = {
  completedBundles: number
  totalBundles: number
  isComplete: boolean
}

/* ---------------------------------- */
/* Aggregated View Sections */
/* ---------------------------------- */

export type BundleSection = {
  bundle: Bundle
  progress: BundleProgress
  items: BundleItem[]
}

export type RoomSection = {
  room: Room
  progress: RoomProgress
  bundles: BundleSection[]
}
