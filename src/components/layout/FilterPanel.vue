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
        @click="updateFilter(group.model, option.key)"
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { FilterState, ItemType, RoomStatus, Season, ViewStatus } from '@/types'
import { FILTER_GROUPS } from '@/constants/filterConfig'
import FilterButton from './FilterButton.vue'

type FilterModelKey = keyof FilterState

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

function updateFilter(model: FilterModelKey, value: FilterState[FilterModelKey]) {
  switch (model) {
    case 'bundleSeason':
      emit('update:bundleSeason', value as Season | null)
      break
    case 'seasonViewSeason':
      emit('update:seasonViewSeason', value as Season | null)
      break
    case 'type':
      emit('update:type', value as ItemType | null)
      break
    case 'roomStatus':
      emit('update:roomStatus', value as RoomStatus | null)
      break
  }
}
</script>
