import type { Season } from '@/types'

export function isItemAvailableInSeason(
  itemSeasons: Season[] | undefined,
  selectedSeason: Season | 'all',
) {
  if (!itemSeasons) return false
  if (selectedSeason === 'all') return true

  return itemSeasons.includes(selectedSeason) || itemSeasons.includes('any')
}
