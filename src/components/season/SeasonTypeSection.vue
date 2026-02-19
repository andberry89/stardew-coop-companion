<template>
  <div class="space-y-4">
    <!-- Type Header -->
    <div class="flex justify-between items-center border-b border-zinc-300 pb-1">
      <h3 class="text-lg font-stardew-bold text-orange-900">
        {{ typeLabel }}
      </h3>

      <span class="text-sm text-zinc-600">
        {{ typeProgress.completed }} / {{ typeProgress.total }}
      </span>
    </div>

    <!-- Items -->
    <SeasonItemRow v-for="entry in items" :key="entry.item.id" :entry="entry" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SeasonItemRow from './SeasonItemRow.vue'
import type { ItemType, SeasonItemEntry } from '@/types'

const props = defineProps<{
  type: ItemType
  items: SeasonItemEntry[]
}>()

const typeProgress = computed(() => {
  let total = 0
  let completed = 0

  for (const entry of props.items) {
    total += entry.usages.length
    completed += entry.usages.reduce((acc, u) => acc + (u.completed ? 1 : 0), 0)
  }

  return { total, completed }
})

const typeLabel = computed(() => {
  const map: Record<ItemType, string> = {
    forage: 'Foraging',
    crop: 'Crops',
    fish: 'Fish',
    artisan: 'Artisan',
    animal: 'Animal Product',
    mining: 'Mining',
    resource: 'Resource',
    cooking: 'Cooking',
    other: 'Other',
  }

  return map[props.type]
})
</script>
