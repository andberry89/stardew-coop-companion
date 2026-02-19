<template>
  <div
    class="relative flex flex-col justify-between gap-4 bg-amber-200 px-2 py-4 h-max border-2 border-bundle shadow-lg"
    :class="{
      'border-green-600 ring-2 ring-green-400': isBundleFull,
    }"
  >
    <Transition name="sparkle">
      <div v-if="showSparkle" class="absolute z-99 inset-0 pointer-events-none">
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
    <div class="flex gap-4 justify-start">
      <img :src="bundleIcon" alt="Bundle Icon" class="size-8" />
      <h3 class="text-sm leading-7 tracking-tighter font-stardew-bold text-orange-950 mb-4">
        {{ props.bundleSection.bundle.name }}
      </h3>
      <!--<span class="text-sm text-zinc-500 font-stardew-thin justify-self-end"
        >{{ props.bundleSection.progress.completed }}/{{
          props.bundleSection.progress.required
        }}</span
      > -->
    </div>
    <div class="space-y-1">
      <BundleItems
        :items="props.bundleSection.items"
        :selected-season="props.selectedSeason"
        :bundle-full="isBundleFull"
        @toggle="toggleEntry"
      />
    </div>
    <div class="flex justify-center gap-1">
      <div
        v-for="i in props.bundleSection.bundle.requiredCount"
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
import { computed, ref, watch } from 'vue'
import { useBundlesStore } from '@/stores/bundles'
import BundleItems from './BundleItems.vue'

const props = defineProps({
  bundleSection: Object,
  selectedSeason: String,
})

const store = useBundlesStore()

const sparkles = ref([])

const showSparkle = ref(false)

const bundleIcon = computed(() => {
  return `/images/icons/${props.bundleSection.bundle.bundleIcon}`
})

const completedItems = computed(() => store.completedItemsForBundle(props.bundleSection.bundle.id))

const isBundleFull = computed(
  () => props.bundleSection.progress.completed >= props.bundleSection.bundle.requiredCount,
)

const rewardImg = computed(() => {
  return `/images/rewards/${props.bundleSection.bundle.rewardImg}`
})

function generateSparkles() {
  const length = props.bundleSection.bundle.requiredCount
  sparkles.value = Array.from({ length: length }).map((_, i) => ({
    id: i,
    top: `${20 + Math.random() * 60}%`,
    left: `${20 + Math.random() * 60}%`,
    rotate: Math.random() * 60 - 30,
    size: `${18 + Math.random() * 8}px`,
    delay: `${i * 0.15}s`, // stagger start
  }))
}

function toggleEntry(entryKey) {
  store.toggleEntry(entryKey)
}

watch(isBundleFull, (newVal, oldVal) => {
  if (newVal && !oldVal) {
    generateSparkles()
    showSparkle.value = true

    setTimeout(() => {
      showSparkle.value = false
    }, 900)
  }
})
</script>
