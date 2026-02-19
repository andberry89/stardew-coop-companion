<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center border-b border-zinc-300 pb-1">
      <h3 class="text-lg font-stardew-bold text-orange-900">
        {{ typeLabel }}
      </h3>

      <span class="text-sm text-zinc-600">
        {{ typeProgress.completed }} / {{ typeProgress.total }}
      </span>
    </div>

    <SeasonItemRow
      v-for="row in items"
      :key="
        row.item.id +
        ':' +
        (row.requirement.minQuality ?? 'normal') +
        ':' +
        row.requirement.requiredPerSubmission
      "
      :row="row"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SeasonItemRow from './SeasonItemRow.vue'
import type { ItemType, SeasonDisplayRow } from '@/types'

const props = defineProps<{
  type: ItemType
  items: SeasonDisplayRow[]
}>()

const typeProgress = computed(() => {
  let total = 0
  let completed = 0

  for (const row of props.items) {
    total += row.usages.length
    completed += row.usages.reduce((acc, u) => acc + (u.completed ? 1 : 0), 0)
  }

  return { total, completed }
})

const typeLabel = computed(() => {
  const map: Record<ItemType, string> = {
    forage: 'Foraging',
    crop: 'Crops',
    fish: 'Fish',
    artisan: 'Artisan',
    animal: 'Animal Products',
    mining: 'Mining',
    resource: 'Resources',
    cooking: 'Cooking',
    other: 'Other',
  }

  return map[props.type]
})
</script>
