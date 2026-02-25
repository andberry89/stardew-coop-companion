<template>
  <aside
    class="w-46 p-4 border-menu grad-amber rounded-lg flex flex-col gap-4 font-quicksand text-orange-950 h-max sticky top-6 self-start"
  >
    <h2 class="font-stardew-bold text-center">Filter</h2>

    <div v-for="group in FILTER_GROUPS[props.view]" :key="group.model">
      <h3 v-if="group.title">{{ group.title }}</h3>

      <FilterButton
        v-for="option in group.options"
        :key="option.key"
        :label="option.label"
        :icon="option.icon"
        :active="props.filters[group.model] === option.key"
        @click="emit(`update:${group.model}`, option.key)"
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { ItemType, Season, ViewStatus } from '@/types'
import type { FilterState } from '@/types/filters'
import { FILTER_GROUPS } from '@/constants/filterConfig'
import FilterButton from './FilterButton.vue'

const props = defineProps<{
  view: ViewStatus
  filters: FilterState
}>()

const emit = defineEmits<{
  (e: 'update:bundleSeason', value: Season | null): void
  (e: 'update:seasonViewSeason', value: Season | null): void
  (e: 'update:type', value: ItemType | null): void
  (e: 'update:roomStatus', value: RoomStatus | null): void
}>()
</script>
