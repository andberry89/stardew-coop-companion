<template>
  <aside
    class="w-46 p-4 border-menu grad-background rounded-lg flex flex-col gap-4 font-quicksand text-orange-950 h-max sticky top-6 self-start"
  >
    <h2 class="font-stardew-bold text-center">Filter</h2>

    <!-- Bundle View Season Filters -->
    <div v-if="view === 'bundle'">
      <button
        v-for="s in bundleSeasons"
        :key="s.key"
        @click="emit('update:bundleSeason', s.key)"
        :class="[baseBtnClasses, bundleSeason === s.key ? activeClasses : inactiveClasses]"
      >
        <img :src="s.icon" :alt="s.name" class="w-6 h-6" />
        <span>{{ s.name }}</span>
      </button>
    </div>

    <!-- Season View Filters -->
    <div v-else>
      <!-- Season Filter (SeasonView) -->
      <h3 class="text-[10px] font-stardew-thin uppercase tracking-wide text-orange-800 mt-2 mb-2">
        Season
      </h3>
      <button
        v-for="s in seasonViewSeasons"
        :key="s.key"
        @click="handleSeasonViewSeason(s.key)"
        :class="[baseBtnClasses, seasonViewSeason === s.key ? activeClasses : inactiveClasses]"
      >
        <img :src="s.icon" :alt="s.name" class="w-6 h-6" />
        <span>{{ s.name }}</span>
      </button>

      <!-- Type Filter -->
      <h3 class="text-[10px] font-stardew-thin uppercase tracking-wide text-orange-800 mt-4 mb-2">
        Type
      </h3>
      <button
        v-for="t in types"
        :key="t.key"
        @click="emit('update:selectedType', t.key)"
        :class="[baseBtnClasses, selectedType === t.key ? activeClasses : inactiveClasses]"
      >
        <img :src="t.icon" :alt="t.label" class="w-6 h-6" />
        {{ t.label }}
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { Season, ItemType } from '@/types'

const { view, bundleSeason, seasonViewSeason, selectedType } = defineProps<{
  view: 'bundle' | 'season'
  bundleSeason: Season | null
  seasonViewSeason: Season | null
  selectedType: ItemType | null
}>()

const emit = defineEmits<{
  (e: 'update:bundleSeason', value: Season | null): void
  (e: 'update:seasonViewSeason', value: Season | null): void
  (e: 'update:selectedType', value: ItemType | null): void
}>()

/**
 * Bundle View Seasons
 */
const bundleSeasons: { key: Season | null; name: string; icon: string }[] = [
  { key: null, name: 'All', icon: '/images/seasons/all-seasons.png' },
  { key: 'spring', name: 'Spring', icon: '/images/seasons/spring.png' },
  { key: 'summer', name: 'Summer', icon: '/images/seasons/summer.png' },
  { key: 'fall', name: 'Fall', icon: '/images/seasons/fall.png' },
  { key: 'winter', name: 'Winter', icon: '/images/seasons/winter.png' },
]

/**
 * Season View Seasons (null = All)
 */
const seasonViewSeasons: { key: Season | null; name: string; icon: string }[] = [
  { key: null, name: 'All', icon: '/images/seasons/all-seasons.png' },
  { key: 'spring', name: 'Spring', icon: '/images/seasons/spring.png' },
  { key: 'summer', name: 'Summer', icon: '/images/seasons/summer.png' },
  { key: 'fall', name: 'Fall', icon: '/images/seasons/fall.png' },
  { key: 'winter', name: 'Winter', icon: '/images/seasons/winter.png' },
]

/**
 * Type filters (SeasonView)
 */
const types: { key: ItemType | null; name: string; icond: string }[] = [
  { key: null, label: 'All Types', icon: `/images/seasons/types/inventory.png` },
  { key: 'crop', label: 'Crop', icon: `/images/seasons/types/farming-skill.png` },
  { key: 'forage', label: 'Forage', icon: `/images/seasons/types/foraging-skill.png` },
  { key: 'fish', label: 'Fish', icon: `/images/seasons/types/midnight-carp.png` },
  { key: 'artisan', label: 'Artisan', icon: `/images/seasons/types/mead.png` },
  { key: 'animal', label: 'Animal', icon: `/images/seasons/types/blue-chicken.png` },
  { key: 'mining', label: 'Mining', icon: `/images/seasons/types/mining-skill.png` },
  { key: 'resource', label: 'Resource', icon: `/images/seasons/types/alamite.png` },
]

const baseBtnClasses =
  'border-menu bg-amber-200 p-1 flex items-center gap-2 mb-1 w-full transition-all duration-150 text-md'

const activeClasses = 'opacity-100 scale-105 border-2 border-orange-500'

const inactiveClasses = 'opacity-40 hover:opacity-60'

function handleSeasonViewSeason(key: Season | null) {
  emit('update:seasonViewSeason', key)
}
</script>
