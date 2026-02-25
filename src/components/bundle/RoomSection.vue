<template>
  <section class="space-y-4 p-1 border-menu grad-amber shadow-lg">
    <div class="px-4 py-2 flex justify-between items-center">
      <h2 class="text-xl font-stardew-bold text-orange-950">
        {{ roomSection.room.name }}
      </h2>

      <span class="text-sm font-stardew-thin text-zinc-500">
        {{ roomSection.progress.completedBundles }}/{{ roomSection.progress.totalBundles }}
      </span>
    </div>

    <div class="grid gap-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
      <BundleCard
        v-for="bundleSection in roomSection.bundles"
        :key="bundleSection.bundle.id"
        :bundle-section="bundleSection"
        :selected-season="selectedSeason"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import BundleCard from './BundleCard.vue'
import type { Season, RoomSection as RoomSectionType } from '@/types'

const { roomSection, selectedSeason } = defineProps<{
  roomSection: RoomSectionType
  selectedSeason: Season | null
}>()
</script>
