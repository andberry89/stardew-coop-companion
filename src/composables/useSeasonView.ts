import { computed, type Ref } from 'vue'
import { useBundlesStore } from '@/stores/bundles'
import type { Season, ItemType, SeasonDisplayRow } from '@/types'
import { splitEntryIntoRows } from '@/utils/seasonTransform'
import { ALL_SEASONS } from '@/constants/seasons'
import { ITEM_TYPE_ORDER } from '@/constants/itemTypes'

export function useSeasonView(season: Ref<Season | null>, selectedType: Ref<ItemType | null>) {
  const store = useBundlesStore()

  // The Seasonal view shows either the selected season plus "any",
  // or all seasons plus "any" when no specific season is selected.
  const seasonGroups = computed<Season[]>(() => {
    if (!season.value) return [...ALL_SEASONS, 'any']
    return [season.value, 'any']
  })

  // Prepare data for the Seasonal view by filtering tracker entries,
  // splitting multi-item entries into rows, and grouping them by item type.
  const groupedBySeasonAndType = computed(() => {
    const result: Partial<Record<Season, Partial<Record<ItemType, SeasonDisplayRow[]>>>> = {}

    for (const seasonKey of seasonGroups.value) {
      const entries = store.seasonView(seasonKey)

      // The "any" section only shows items available in any season.
      // All other sections only keep items that match that season.
      const seasonFiltered = entries.filter((entry) => {
        if (seasonKey === 'any') return entry.item.seasons.includes('any')
        return entry.item.seasons.includes(seasonKey)
      })

      const rowsByType: Partial<Record<ItemType, SeasonDisplayRow[]>> = {}

      for (const entry of seasonFiltered) {
        // Split entries into display rows so the Seasonal view can render
        // multi-item bundle requirements consistently.
        const rows = splitEntryIntoRows(entry)

        for (const row of rows) {
          const type = row.item.type

          if (selectedType.value && selectedType.value !== type) continue

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
    ITEM_TYPE_ORDER,
    seasonGroups,
    groupedBySeasonAndType,
  }
}
