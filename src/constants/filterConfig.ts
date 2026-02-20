import type { FilterState } from '@/types'
import { SEASON_FILTERS, TYPE_FILTERS, ROOM_FILTERS } from './filters'

export const FILTER_GROUPS = {
  bundle: [{ title: null, options: SEASON_FILTERS, model: 'bundleSeason' as const }],
  season: [
    { title: 'Season', options: SEASON_FILTERS, model: 'seasonViewSeason' as const },
    { title: 'Type', options: TYPE_FILTERS, model: 'type' as const },
  ],
  room: [{ title: 'Status', options: ROOM_FILTERS, model: 'roomStatus' as const }],
} as const
