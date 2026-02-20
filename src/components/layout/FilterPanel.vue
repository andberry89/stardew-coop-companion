<template>
  <aside
    class="w-46 p-4 border-menu grad-background rounded-lg flex flex-col gap-4 font-quicksand text-orange-950 h-max sticky top-6 self-start"
  >
    <h2 class="font-stardew-bold text-center">Filter</h2>

    <!-- Bundle View -->
    <div v-if="props.view === 'bundle'">
      <FilterButton
        v-for="s in SEASON_FILTERS"
        :key="s.key"
        :label="s.label"
        :icon="s.icon"
        :active="props.filters.bundleSeason === s.key"
        @click="emit('update:bundleSeason', s.key)"
      />
    </div>

    <!-- Season View -->
    <div v-else>
      <h3 class="text-[10px] font-stardew-thin uppercase tracking-wide text-orange-800 mt-2 mb-2">
        Season
      </h3>

      <FilterButton
        v-for="s in SEASON_FILTERS"
        :key="s.key"
        :label="s.label"
        :icon="s.icon"
        :active="props.filters.seasonViewSeason === s.key"
        @click="emit('update:seasonViewSeason', s.key)"
      />

      <h3 class="text-[10px] font-stardew-thin uppercase tracking-wide text-orange-800 mt-4 mb-2">
        Type
      </h3>

      <FilterButton
        v-for="t in TYPE_FILTERS"
        :key="t.key"
        :label="t.label"
        :icon="t.icon"
        :active="props.filters.type === t.key"
        @click="emit('update:type', t.key)"
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { Season, ItemType } from '@/types'
import type { FilterState } from '@/types/filters'
import { SEASON_FILTERS, TYPE_FILTERS } from '@/constants/filters'
import FilterButton from './FilterButton.vue'

const props = defineProps<{
  view: 'bundle' | 'season'
  filters: FilterState
}>()

const emit = defineEmits<{
  (e: 'update:bundleSeason', value: Season | null): void
  (e: 'update:seasonViewSeason', value: Season | null): void
  (e: 'update:type', value: ItemType | null): void
}>()
</script>
