<template>
  <div class="space-y-4">
    <!-- Type Header (Clickable) -->
    <div
      class="flex justify-between items-center cursor-pointer select-none"
      @click="isOpen = !isOpen"
    >
      <div class="flex items-center gap-2">
        <!-- Chevron -->
        <span class="transition-transform duration-150" :class="{ 'rotate-90': isOpen }"> ▶ </span>

        <h3 class="text-lg font-stardew-bold text-orange-900">
          {{ typeLabel }}
        </h3>
      </div>

      <span class="text-sm text-zinc-600">
        {{ typeProgress.completed }} / {{ typeProgress.total }}
      </span>
    </div>

    <!-- Rows -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[1000px]"
      leave-from-class="opacity-100 max-h-[1000px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="isOpen" class="overflow-hidden">
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
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import SeasonItemRow from './SeasonItemRow.vue'
import type { ItemType, SeasonDisplayRow } from '@/types'
import { ITEM_TYPE_LABELS } from '@/constants/itemTypeLabels'

const props = defineProps<{
  type: ItemType
  items: SeasonDisplayRow[]
}>()

const isOpen = ref(true)

const typeProgress = computed(() => {
  let total = 0
  let completed = 0

  for (const row of props.items) {
    total += row.usages.length
    completed += row.usages.reduce((acc, u) => acc + (u.completed ? 1 : 0), 0)
  }

  return { total, completed }
})

const typeLabel = computed(() => ITEM_TYPE_LABELS[props.type])
</script>
