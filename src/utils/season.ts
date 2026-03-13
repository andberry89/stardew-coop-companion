import type { Season } from '@/types'

// Check whether an item should be visible for the selected season
// in the Seasonal tracker view.
export function isItemAvailableInSeason(
  itemSeasons: Season[] | undefined,
  selectedSeason: Season | null,
) {
  if (!itemSeasons) return false
  if (!selectedSeason) return true

  return itemSeasons.includes(selectedSeason) || itemSeasons.includes('any')
}
