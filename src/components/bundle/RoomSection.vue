<template>
  <section class="space-y-4">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-stardew-bold text-orange-950">
        {{ roomSection.room.name }}
      </h2>

      <span class="text-sm text-zinc-500">
        {{ roomSection.progress.completedBundles }}/{{ roomSection.progress.totalBundles }}
      </span>
    </div>

    <img :src="roomImg" class="w-full object-cover rounded-lg" alt="" />

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-4">
      <BundleCard
        v-for="bundleSection in roomSection.bundles"
        :key="bundleSection.bundle.id"
        :bundle-section="bundleSection"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps({
  roomSection: Object,
})

const roomImg = computed(() =>
  props.roomSection.progress.isComplete
    ? props.roomSection.room.imgAfter
    : props.roomSection.room.imgBefore,
)
</script>
