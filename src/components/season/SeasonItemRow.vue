<template>
  <div
    class="p-2 rounded-md border transition"
    :class="{
      'bg-green-100 border-green-400': isFullyComplete,
    }"
  >
    <!-- Top Row -->
    <div class="flex justify-between items-center">
      <div class="flex items-center gap-3">
        <img :src="`/images/items/${entry.item.id}.png`" class="size-10" alt="" />
        <span class="font-quicksand text-base">
          {{ entry.item.name }}
        </span>
      </div>

      <span class="text-sm text-zinc-600">
        {{ itemProgress.completed }} / {{ itemProgress.total }}
      </span>
    </div>

    <!-- Bundle Usages -->
    <div class="mt-2 ml-12 space-y-1 text-sm">
      <div v-for="usage in entry.usages" :key="usage.entryKey" class="flex items-center gap-2">
        <span>
          {{ usage.completed ? '✓' : '○' }}
        </span>

        <span>{{ usage.bundleName }}</span>

        <span v-if="usage.requiredPerSubmission > 1"> ×{{ usage.requiredPerSubmission }} </span>

        <img v-if="usage.minQuality" src="/images/icons/gold-quality-icon.png" class="size-4" />
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
</script>
