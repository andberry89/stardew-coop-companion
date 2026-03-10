import type { FilterState, ItemType, RoomStatus, Season, ViewStatus } from '@/types'
import { SEASON_FILTERS, TYPE_FILTERS, ROOM_FILTERS } from './filters'

type FilterModelKey = keyof FilterState

type FilterOption<T> = {
  key: T | null
  label: string
  icon?: string
}

type FilterGroup<K extends FilterModelKey> = {
  title: string | null
  options: ReadonlyArray<FilterOption<FilterState[K]>>
  model: K
}

export const FILTER_GROUPS: Record<ViewStatus, ReadonlyArray<FilterGroup<FilterModelKey>>> = {
  bundle: [
    {
      title: null,
      options: SEASON_FILTERS as ReadonlyArray<FilterOption<Season>>,
      model: 'bundleSeason',
    },
  ],
  season: [
    {
      title: 'Season',
      options: SEASON_FILTERS as ReadonlyArray<FilterOption<Season>>,
      model: 'seasonViewSeason',
    },
    {
      title: 'Type',
      options: TYPE_FILTERS as ReadonlyArray<FilterOption<ItemType>>,
      model: 'type',
    },
  ],
  room: [
    {
      title: 'Status',
      options: ROOM_FILTERS as ReadonlyArray<FilterOption<RoomStatus>>,
      model: 'roomStatus',
    },
  ],
}
