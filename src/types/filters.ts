import type { Season, ItemType } from '@/types'

// Generic filter option used by the tracker filter UI.
export type FilterOption<T> = {
  key: T
  label: string
  icon?: string
}

export type NullableFilterOption<T> = FilterOption<T | null>

// Completion filter used by the Room view.
export type RoomStatus = 'complete' | 'incomplete'

// Current filter selections applied across the different tracker views.
export type FilterState = {
  bundleSeason: Season | null
  seasonViewSeason: Season | null
  type: ItemType | null
  roomStatus: RoomStatus | null
}
