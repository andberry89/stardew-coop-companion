<template>
  <section class="space-y-4 p-1 border-menu grad-background shadow-lg">
    <div class="px-4 py-2 rounded-lg flex justify-between items-center">
      <h2 class="text-xl font-stardew-bold text-orange-950">
        {{ props.roomSection.room.name }}
      </h2>

      <span class="text-sm font-stardew-thin text-zinc-500">
        {{ props.roomSection.progress.completedBundles }}/{{
          props.roomSection.progress.totalBundles
        }}
      </span>
    </div>

    <!-- <img :src="roomImg" class="w-full object-cover rounded-lg" alt="" /> -->

    <div class="grid gap-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
      <BundleCard
        v-for="bundleSection in props.roomSection.bundles"
        :key="bundleSection.bundle.id"
        :bundle-section="bundleSection"
        :selected-season="props.selectedSeason"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import BundleCard from './BundleCard.vue'

const props = defineProps({
  roomSection: Object,
  selectedSeason: String,
})

// const roomImg = computed(() =>
//   props.roomSection.progress.isComplete
//     ? props.roomSection.room.imgAfter
//     : props.roomSection.room.imgBefore,
// )
</script>
