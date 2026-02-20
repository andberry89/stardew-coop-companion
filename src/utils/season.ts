import type { Season } from '@/types'

export function isItemAvailableInSeason(itemSeasons: Season[] | undefined, selectedSeason: Season | null) {
  if (!itemSeasons) return false
  if (!selectedSeason) return true

  return itemSeasons.includes(selectedSeason) || itemSeasons.includes('any')
}
