<template>
  <div
    class="flex items-center justify-between py-1.5 transition"
    :class="{
      'bg-green-100/60': isFullyComplete,
    }"
  >
    <!-- LEFT: Icon + Name -->
    <div class="flex items-center gap-3 min-w-55">
      <!-- Icon (no wrapper styling) -->
      <div class="relative size-10 flex items-center justify-center">
        <img :src="`/images/items/${entry.item.id}.png`" class="size-10" alt="" />

        <!-- Quality Badge -->
        <img
          v-if="highestQuality"
          :src="qualityIconFor(highestQuality)"
          class="absolute bottom-0 left-0 size-5"
        />

        <!-- Quantity Badge -->
        <div
          v-if="maxRequired > 1"
          class="absolute bottom-0 right-0 bg-[rgba(0,0,0,0.75)] text-white text-[10px] font-bold px-0.5 rounded"
        >
          x{{ maxRequired }}
        </div>
      </div>

      <!-- Name + Progress -->
      <div class="flex items-baseline gap-2">
        <span class="font-quicksand text-base">
          {{ entry.item.name }}
        </span>

        <span class="text-sm text-zinc-600">
          ({{ itemProgress.completed }} / {{ itemProgress.total }})
        </span>
      </div>
    </div>

    <!-- CENTER: Sources (vertically centered) -->
    <div class="flex-1 px-6 text-sm text-zinc-700 text-center">
      <div v-for="source in entry.item.sources" :key="source" class="leading-tight">
        {{ source }}
      </div>
    </div>

    <!-- RIGHT: Bundle usages -->
    <div class="flex flex-col items-end text-sm leading-tight space-y-0.5 min-w-50">
      <div v-for="usage in entry.usages" :key="usage.entryKey" class="flex items-center gap-1">
        <span>
          {{ usage.completed ? '✓' : '○' }}
        </span>

        <span>
          {{ usage.bundleName }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { SeasonItemEntry } from '@/types'

const props = defineProps<{
  entry: SeasonItemEntry
}>()

const itemProgress = computed(() => {
  const total = props.entry.usages.length
  const completed = props.entry.usages.reduce((acc, u) => acc + (u.completed ? 1 : 0), 0)
  return { total, completed }
})

const isFullyComplete = computed(
  () => itemProgress.value.total > 0 && itemProgress.value.completed === itemProgress.value.total,
)

const maxRequired = computed(() =>
  Math.max(...props.entry.usages.map((u) => u.requiredPerSubmission ?? 1)),
)

const highestQuality = computed(() => {
  const qualities = props.entry.usages.map((u) => u.minQuality).filter(Boolean)

  if (!qualities.length) return null

  const order = ['normal', 'silver', 'gold', 'iridium']
  return qualities.sort((a, b) => order.indexOf(a!) - order.indexOf(b!)).pop()
})

function qualityIconFor(quality: string) {
  return `/images/icons/${quality}-quality-icon.png`
}
</script>
