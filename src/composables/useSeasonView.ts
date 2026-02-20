import { computed } from 'vue'
import { useBundlesStore } from '@/stores/bundles'
import type { Season, ItemType, SeasonDisplayRow } from '@/types'
import { splitEntryIntoRows } from '@/utils/seasonTransform'
import { ALL_SEASONS } from '@/constants/seasons'

export function useSeasonView(season: Season | null, selectedType: ItemType | null) {
  const store = useBundlesStore()

  const TYPE_ORDER: ItemType[] = [
    'forage',
    'crop',
    'fish',
    'artisan',
    'animal',
    'mining',
    'resource',
  ]

  const seasonGroups = computed<Season[]>(() => {
    if (!season) return [...ALL_SEASONS, 'any']
    return [season, 'any']
  })

  const groupedBySeasonAndType = computed(() => {
    const result: Partial<Record<Season, Partial<Record<ItemType, SeasonDisplayRow[]>>>> = {}

    for (const seasonKey of seasonGroups.value) {
      const entries = store.seasonView(seasonKey)

      const seasonFiltered = entries.filter((entry) => {
        if (seasonKey === 'any') return entry.item.seasons.includes('any')
        return entry.item.seasons.includes(seasonKey)
      })

      const rowsByType: Partial<Record<ItemType, SeasonDisplayRow[]>> = {}

      for (const entry of seasonFiltered) {
        const rows = splitEntryIntoRows(entry)

        for (const row of rows) {
          const type = row.item.type

          if (selectedType && selectedType !== type) continue

          const arr = rowsByType[type] ?? []
          arr.push(row)
          rowsByType[type] = arr
        }
      }

      result[seasonKey] = rowsByType
    }

    return result
  })

  return {
    TYPE_ORDER,
    seasonGroups,
    groupedBySeasonAndType,
  }
}
