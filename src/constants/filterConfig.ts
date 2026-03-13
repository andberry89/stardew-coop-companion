import type { FilterState, ItemType, RoomStatus, Season, ViewStatus } from '@/types'
import { SEASON_FILTERS, TYPE_FILTERS, ROOM_FILTERS } from './filters'

type FilterModelKey = keyof FilterState

type FilterOption<T> = {
  key: T | null
  label: string
  icon?: string
}

// Describes a filter section shown in the tracker UI.
// Each group controls a specific FilterState field.
type FilterGroup<K extends FilterModelKey> = {
  title: string | null
  options: ReadonlyArray<FilterOption<FilterState[K]>>
  model: K
}

// Defines which filter controls appear in each bundle tracker view.
// Each view maps to the relevant filters used in the UI:
// - Bundle view: season filter
// - Season view: season + item type filters
// - Room view: completion status filter
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
