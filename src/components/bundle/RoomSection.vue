<template>
  <section class="space-y-4 p-1 border-menu grad-amber shadow-lg">
    <div
      class="px-4 py-2 flex justify-between items-center cursor-pointer select-none"
      @click="isOpen = !isOpen"
    >
      <div class="flex items-center gap-2">
        <span class="transition-transform duration-150" :class="{ 'rotate-90': isOpen }"> ▶ </span>

        <h2 class="text-xl font-stardew-bold text-orange-950">
          {{ roomSection.room.name }}
        </h2>
      </div>

      <span class="text-sm font-stardew-thin text-zinc-500">
        {{ roomSection.progress.completedBundles }}/{{ roomSection.progress.totalBundles }}
      </span>
    </div>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[2000px]"
      leave-from-class="opacity-100 max-h-[2000px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="isOpen" class="overflow-hidden">
        <div class="grid gap-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          <BundleCard
            v-for="bundleSection in roomSection.bundles"
            :key="bundleSection.bundle.id"
            :bundle-section="bundleSection"
            :selected-season="selectedSeason"
          />
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import BundleCard from './BundleCard.vue'
import type { Season, RoomSection as RoomSectionType } from '@/types'

const { roomSection, selectedSeason } = defineProps<{
  roomSection: RoomSectionType
  selectedSeason: Season | null
}>()

const isOpen = ref(true)
</script>
