<template>
  <section
    class="w-46 border-menu grad-background p-2 rounded-lg flex flex-col gap-4 font-stardew-thin text-orange-950 h-max"
  >
    <h2 class="font-stardew-bold text-center">Filter</h2>

    <button
      v-for="s in seasons"
      :key="s.key"
      @click="$emit('seasonChange', s.key)"
      :class="btnClass(s.key === props.selected)"
    >
      <img :src="s.icon" :alt="s.name" class="w-8 h-6" />
      {{ s.name }}
    </button>
  </section>
</template>

<script setup lang="ts">
const props = defineProps({
  selected: {
    type: String,
    default: 'all',
  },
})

function btnClass(isActive: boolean) {
  return [
    'border-menu bg-amber-200 p-1 flex gap-2 items-center w-full transition-opacity duration-150 text-xs',
    isActive ? 'opacity-100' : 'opacity-40 hover:opacity-60',
  ].join(' ')
}
const seasons = [
  { key: 'all', name: 'All', icon: '/images/seasons/all-seasons.png' },
  { key: 'spring', name: 'Spring', icon: '/images/seasons/spring.png' },
  { key: 'summer', name: 'Summer', icon: '/images/seasons/summer.png' },
  { key: 'fall', name: 'Fall', icon: '/images/seasons/fall.png' },
  { key: 'winter', name: 'Winter', icon: '/images/seasons/winter.png' },
]
</script>
