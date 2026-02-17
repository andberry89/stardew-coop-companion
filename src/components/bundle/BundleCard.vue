<template>
  <div
    class="flex flex-col justify-between gap-4 bg-amber-200 px-2 py-4 h-max border-2 border-bundle shadow-lg"
  >
    <div class="flex gap-4 justify-start">
      <img :src="bundleIcon" alt="Bundle Icon" class="size-8" />
      <h3 class="text-sm leading-7 tracking-tighter font-stardew-bold text-orange-950 mb-4">
        {{ props.bundleSection.bundle.name }}
      </h3>
      <span v-if="showProgress" class="text-sm text-zinc-500 font-stardew-thin justify-self-end"
        >{{ props.bundleSection.progress.completed }}/{{
          props.bundleSection.progress.required
        }}</span
      >
    </div>
    <div class="space-y-1">
      <BundleItems :items="props.bundleSection.items" :selected-season="props.selectedSeason" />
    </div>
    <div class="flex justify-center gap-1">
      <div
        v-for="i in props.bundleSection.bundle.requiredCount"
        :key="i"
        class="slot size-12"
      ></div>
    </div>
    <div class="mt-2 font-sm font-quicksand flex items-end gap-1">
      <img src="/images/icons/bundle-reward.png" alt="Bundle Reward" class="size-6" /><strong
        >Reward:</strong
      >
      {{ props.bundleSection.bundle.reward }}
      <img :src="rewardImg" alt="Reward Icon" class="max-h-8 w-auto" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import BundleItems from './BundleItems.vue'

const props = defineProps({
  bundleSection: Object,
  selectedSeason: String,
})

const showProgress = ref(false)

const bundleIcon = computed(() => {
  return `/images/icons/${props.bundleSection.bundle.bundleIcon}`
})

const rewardImg = computed(() => {
  return `/images/rewards/${props.bundleSection.bundle.rewardImg}`
})
</script>
