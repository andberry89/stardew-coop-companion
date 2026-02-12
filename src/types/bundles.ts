import type { RoomId } from '@/types/rooms'

export type Season = 'spring' | 'summer' | 'fall' | 'winter' | 'any'

export type ItemType =
  | 'animal'
  | 'artisan'
  | 'cooking'
  | 'crop'
  | 'fish'
  | 'forage'
  | 'mineral'
  | 'other'
  | 'resource'

export type Quality = 'normal' | 'silver' | 'gold' | 'iridium'

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
  reward: string
  rewardImg: string
  requiredCount: number
  bundleImg: string
  bundleIcon: string
}

export type BundleEntry = {
  id: string
  bundleId: string

  itemId?: string
  optionItemIds?: string[]

  requiredPerSubmission?: number // default 1

  notes?: string
}

export type Room =
  | 'pantry'
  | 'crafts-room'
  | 'fish-tank'
  | 'boiler-room'
  | 'bulletin-board'
  | 'vault'
