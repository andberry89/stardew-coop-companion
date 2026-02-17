<template>
  <section
    class="w-46 border-menu grad-background p-2 rounded-lg flex flex-col gap-4 font-stardew-thin text-orange-950 h-max"
  >
    <h2 class="font-stardew-bold text-center">Filter</h2>

    <!-- Bundle View Season Filters -->
    <div v-if="props.view === 'bundle'">
      <button
        v-for="s in seasons"
        :key="s.key"
        @click="selectSeason(s.key)"
        :class="[baseBtnClasses, props.selectedSeason === s.key ? activeClasses : inactiveClasses]"
      >
        <img :src="s.icon" :alt="s.name" class="w-6 h-6" />
        <span>{{ s.name }}</span>
      </button>
    </div>

    <!-- Season View Type Filters -->
    <div v-else>
      <button
        v-for="t in types"
        :key="t.key"
        @click="selectType(t.key)"
        :class="[baseBtnClasses, props.selectedType === t.key ? activeClasses : inactiveClasses]"
      >
        {{ t.label }}
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps({
  view: {
    type: String as PropType<'bundle' | 'season'>,
    required: true,
  },
  selectedSeason: {
    type: String,
    default: 'all',
  },
  selectedType: {
    type: String,
    default: 'all',
  },
})

const emit = defineEmits(['update:selectedSeason', 'update:selectedType'])

// Season filter definitions
const seasons = [
  { key: 'all', name: 'All', icon: '/images/seasons/all-seasons.png' },
  { key: 'spring', name: 'Spring', icon: '/images/seasons/spring.png' },
  { key: 'summer', name: 'Summer', icon: '/images/seasons/summer.png' },
  { key: 'fall', name: 'Fall', icon: '/images/seasons/fall.png' },
  { key: 'winter', name: 'Winter', icon: '/images/seasons/winter.png' },
]

// Type filter definitions for Season View
const types = [
  { key: 'all', label: 'All Types' },
  { key: 'crop', label: 'Crop' },
  { key: 'forage', label: 'Forage' },
  { key: 'fish', label: 'Fish' },
  { key: 'animal', label: 'Animal' },
  { key: 'resource', label: 'Resource' },
  { key: 'other', label: 'Other' },
]

const baseBtnClasses =
  'border-menu bg-amber-200 p-2 flex items-center gap-2 mb-1 w-full transition-all duration-150 text-[12px]'

const activeClasses = 'opacity-100 scale-105 border-2 border-orange-500'

const inactiveClasses = 'opacity-40 hover:opacity-60'

// Emitters
function selectSeason(key: string) {
  emit('update:selectedSeason', key)
}

function selectType(key: string) {
  emit('update:selectedType', key)
}
</script>
