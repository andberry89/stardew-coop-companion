<template>
  <div
    class="relative flex flex-col justify-between gap-4 bg-amber-200 px-2 py-4 h-max border-2 border-bundle shadow-lg"
    :class="{
      'border-green-600 ring-2 ring-green-400': isBundleFull,
    }"
  >
    <!-- Sparkles -->
    <Transition name="sparkle">
      <div v-if="showSparkle" class="absolute inset-0 pointer-events-none z-50">
        <img
          v-for="sparkle in sparkles"
          :key="sparkle.id"
          src="/images/icons/sparkle.png"
          class="absolute animate-sparkle"
          :style="{
            top: sparkle.top,
            left: sparkle.left,
            transform: `rotate(${sparkle.rotate}deg)`,
            width: sparkle.size,
            height: sparkle.size,
            animationDelay: sparkle.delay,
          }"
          alt=""
        />
      </div>
    </Transition>

    <!-- Header -->
    <div class="flex gap-4 justify-start">
      <img :src="bundleIcon" alt="Bundle Icon" class="size-8" />
      <h3 class="text-sm leading-7 tracking-tighter font-stardew-bold text-orange-950 mb-4">
        {{ bundleSection.bundle.name }}
      </h3>
    </div>

    <!-- Items -->
    <div class="space-y-1">
      <BundleItems
        :items="bundleSection.items"
        :selected-season="selectedSeason"
        :bundle-full="isBundleFull"
        @toggle="toggleEntry"
      />
    </div>

    <!-- Completion Slots -->
    <div class="flex justify-center gap-1">
      <div
        v-for="i in bundleSection.bundle.requiredCount"
        :key="i"
        class="slot size-12 flex justify-center items-center"
      >
        <img
          v-if="completedItems[i - 1]"
          :src="`/images/items/${completedItems[i - 1].id}.png`"
          class="object-contain size-8"
          alt=""
        />
      </div>
    </div>

    <!-- Reward -->
    <div class="mt-2 text-sm font-quicksand flex items-end gap-1">
      <img src="/images/icons/bundle-reward.png" alt="Bundle Reward" class="size-6" />
      <strong>Reward:</strong>
      {{ bundleSection.bundle.reward }}
      <img :src="rewardImg" alt="Reward Icon" class="max-h-8 w-auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useBundlesStore } from '@/stores/bundles'
import BundleItems from './BundleItems.vue'
import type { BundleSection, Season } from '@/types'
import { useBundleSparkle } from '@/composables/useBundleSparkle'

const { bundleSection, selectedSeason } = defineProps<{
  bundleSection: BundleSection
  selectedSeason: Season | null
}>()

const store = useBundlesStore()

const { sparkles, showSparkle, triggerSparkle } = useBundleSparkle(
  bundleSection.bundle.requiredCount,
)

const bundleIcon = computed(() => `/images/icons/${bundleSection.bundle.bundleIcon}`)

const completedItems = computed(() => store.completedItemsForBundle(bundleSection.bundle.id))

const isBundleFull = computed(
  () => bundleSection.progress.completed >= bundleSection.bundle.requiredCount,
)

const rewardImg = computed(() => `/images/rewards/${bundleSection.bundle.rewardImg}`)

function toggleEntry(entryKey: string) {
  store.toggleEntry(entryKey)
}

watch(isBundleFull, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    triggerSparkle()
  }
})
</script>
