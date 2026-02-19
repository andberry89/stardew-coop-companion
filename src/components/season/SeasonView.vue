<template>
  <section class="space-y-8 p-4 border-menu grad-background shadow-lg">
    <SeasonSection
      v-for="seasonKey in seasonGroups"
      :key="seasonKey"
      :seasonKey="seasonKey"
      :typeGroups="groupedBySeasonAndType[seasonKey] ?? {}"
      :typeOrder="TYPE_ORDER"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBundlesStore } from '@/stores/bundles'
import SeasonSection from './SeasonSection.vue'
import type { ItemType, Season, SeasonItemEntry } from '@/types'

const props = defineProps<{
  season: Season | null
  selectedType: string
}>()

const store = useBundlesStore()

const ALL_SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter']

// Exported to SeasonSection so it can render types in a stable order.
const TYPE_ORDER: ItemType[] = ['forage', 'crop', 'fish', 'artisan', 'animal', 'mining', 'resource']

const seasonGroups = computed<Season[]>(() => {
  if (!props.season) return [...ALL_SEASONS, 'any']
  return [props.season, 'any']
})

/**
 * Season → Type → Items
 *
 * Rules enforced here:
 * - Store accessed only here.
 * - "any" items only appear in the "any" season group.
 * - Type filtering applied within each season group.
 */
const groupedBySeasonAndType = computed(() => {
  const result: Partial<Record<Season, Partial<Record<ItemType, SeasonItemEntry[]>>>> = {}

  for (const seasonKey of seasonGroups.value) {
    const entries = store.seasonView(seasonKey)

    const seasonFiltered = entries.filter((entry) => {
      if (seasonKey === 'any') return entry.item.seasons.includes('any')
      return entry.item.seasons.includes(seasonKey)
    })

    const bucket: Partial<Record<ItemType, SeasonItemEntry[]>> = {}

    for (const entry of seasonFiltered) {
      const type = entry.item.type

      // Apply type filtering only inside groups
      if (props.selectedType && props.selectedType !== 'all' && props.selectedType !== type) {
        continue
      }

      ;(bucket[type] ??= []).push(entry)
    }

    result[seasonKey] = bucket
  }

  return result
})
</script>
