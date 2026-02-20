<template>
  <div
    class="flex items-center justify-between py-1.5 border-t border-amber-900 transition"
    :class="{ 'bg-green-100/60': isFullyComplete }"
  >
    <!-- LEFT -->
    <div class="flex items-center gap-3 min-w-55">
      <div class="relative size-10 flex items-center justify-center">
        <img :src="`/images/items/${row.item.id}.png`" class="size-10" alt="" />

        <img
          v-if="row.requirement.minQuality"
          :src="qualityIconFor(row.requirement.minQuality)"
          class="absolute bottom-0 left-0 size-8"
        />

        <div
          v-if="row.requirement.requiredPerSubmission > 1"
          class="absolute bottom-0 right-0 bg-[rgba(0,0,0,0.75)] text-white text-[10px] font-bold px-0.5 rounded"
        >
          x{{ row.requirement.requiredPerSubmission }}
        </div>
      </div>

      <div class="flex items-baseline gap-2">
        <span class="font-quicksand text-base">
          {{ row.item.name }}
        </span>

        <span class="text-sm text-zinc-600">
          ({{ itemProgress.completed }} / {{ itemProgress.total }})
        </span>
      </div>
    </div>

    <!-- CENTER -->
    <div class="flex-1 px-6 text-sm text-zinc-700 text-center">
      <div v-for="source in row.item.sources" :key="source" class="leading-tight">
        {{ source }}
      </div>
    </div>

    <!-- RIGHT -->
    <div class="flex flex-col items-end text-sm leading-tight space-y-0.5 min-w-50">
      <div v-for="usage in row.usages" :key="usage.entryKey" class="flex items-center gap-1">
        <span>
          {{ usage.bundleName }}
        </span>
        <span>
          {{ usage.completed ? '✓' : '○' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SeasonDisplayRow } from '@/types'

const props = defineProps<{
  row: SeasonDisplayRow
}>()

const itemProgress = computed(() => {
  const total = props.row.usages.length
  const completed = props.row.usages.reduce((acc, u) => acc + (u.completed ? 1 : 0), 0)
  return { total, completed }
})

const isFullyComplete = computed(
  () => itemProgress.value.total > 0 && itemProgress.value.completed === itemProgress.value.total,
)

function qualityIconFor(quality: string) {
  return `/images/icons/${quality}-quality-icon.png`
}
</script>
