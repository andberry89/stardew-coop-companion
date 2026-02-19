<template>
  <div class="space-y-6 p-4 border-menu grad-background shadow-lg rounded-lg">
    <!-- Season Header -->
    <div class="flex justify-between items-center border-b pb-2">
      <h2 class="text-xl font-stardew-bold text-orange-950">
        {{ seasonLabel }}
      </h2>

      <span class="text-sm text-zinc-600">
        {{ seasonProgress.completed }} / {{ seasonProgress.total }}
      </span>
    </div>

    <!-- Type Sections -->
    <SeasonTypeSection
      v-for="type in orderedTypes"
      :key="type"
      :type="type"
      :items="typeGroups[type] ?? []"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SeasonTypeSection from './SeasonTypeSection.vue'
import type { ItemType, Season, SeasonItemEntry } from '@/types'

const props = defineProps<{
  seasonKey: Season
  typeGroups: Partial<Record<ItemType, SeasonItemEntry[]>>
  typeOrder: ItemType[]
}>()

const seasonLabel = computed(() => {
  if (props.seasonKey === 'any') return 'Year Round'
  return props.seasonKey.charAt(0).toUpperCase() + props.seasonKey.slice(1)
})

const orderedTypes = computed(() => {
  return props.typeOrder.filter((t) => (props.typeGroups[t]?.length ?? 0) > 0)
})

const seasonProgress = computed(() => {
  let total = 0
  let completed = 0

  for (const type of Object.keys(props.typeGroups) as ItemType[]) {
    const entries = props.typeGroups[type] ?? []
    for (const entry of entries) {
      total += entry.usages.length
      completed += entry.usages.reduce((acc, u) => acc + (u.completed ? 1 : 0), 0)
    }
  }

  return { total, completed }
})
</script>
