import type { Season, ItemType } from '@/types'

export type FilterOption<T> = {
  key: T
  label: string
  icon?: string
}

export type NullableFilterOption<T> = FilterOption<T | null>
export type RoomStatus = 'complete' | 'incomplete'

export type FilterState = {
  bundleSeason: Season | null
  seasonViewSeason: Season | null
  type: ItemType | null
  roomStatus: RoomStatus | null
}
