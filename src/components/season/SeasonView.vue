<template>
  <section class="space-y-6 p-4">
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
import type { Season, ItemType, SeasonDisplayRow, SeasonUsage } from '@/types'

const props = defineProps<{
  season: Season | null
  selectedType: string
}>()

const store = useBundlesStore()

const ALL_SEASONS: Season[] = ['spring', 'summer', 'fall', 'winter']

const TYPE_ORDER: ItemType[] = [
  'forage',
  'crop',
  'fish',
  'artisan',
  'animal',
  'mining',
  'resource',
  'other',
  'cooking',
]

const seasonGroups = computed<Season[]>(() => {
  if (!props.season) return [...ALL_SEASONS, 'any']
  return [props.season, 'any']
})

const groupedBySeasonAndType = computed(() => {
  const result: Partial<Record<Season, Partial<Record<ItemType, SeasonDisplayRow[]>>>> = {}

  for (const seasonKey of seasonGroups.value) {
    const entries = store.seasonView(seasonKey)

    const seasonFiltered = entries.filter((entry) => {
      if (seasonKey === 'any') return entry.item.seasons.includes('any')
      return entry.item.seasons.includes(seasonKey)
    })

    const bucket: Partial<Record<ItemType, SeasonDisplayRow[]>> = {}

    for (const entry of seasonFiltered) {
      const type = entry.item.type

      if (props.selectedType && props.selectedType !== 'all' && props.selectedType !== type)
        continue

      const requirementMap = new Map<string, SeasonUsage[]>()

      for (const usage of entry.usages) {
        const quality = usage.minQuality ?? 'normal'
        const qty = usage.requiredPerSubmission ?? 1
        const key = `${quality}:${qty}`

        if (!requirementMap.has(key)) {
          requirementMap.set(key, [])
        }

        requirementMap.get(key)!.push(usage)
      }

      for (const [key, usages] of requirementMap) {
        const [quality, qty] = key.split(':')

        const row: SeasonDisplayRow = {
          item: entry.item,
          inventory: entry.inventory,
          requirement: {
            minQuality: quality === 'normal' ? undefined : quality,
            requiredPerSubmission: Number(qty),
          },
          usages,
        }

        ;(bucket[type] ??= []).push(row)
      }
    }

    result[seasonKey] = bucket
  }

  return result
})
</script>
