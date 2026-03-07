<template>
  <div class="space-y-4 p-4 border-menu grad-amber shadow-lg rounded-lg">
    <!-- Header -->
    <div
      class="flex justify-between items-center border-b pb-2 cursor-pointer select-none"
      @click="isOpen = !isOpen"
    >
      <div class="flex items-center gap-2">
        <span class="transition-transform duration-150" :class="{ 'rotate-90': isOpen }"> ▶ </span>

        <h2 class="text-xl font-stardew-bold text-orange-950">
          {{ roomSection.room.name }}
        </h2>
      </div>

      <span class="text-sm text-zinc-600">
        {{ roomSection.progress.completedBundles }} /
        {{ roomSection.progress.totalBundles }}
      </span>
    </div>

    <!-- Progress Bar -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-[1000px]"
      leave-from-class="opacity-100 max-h-[1000px]"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-if="isOpen" class="overflow-hidden space-y-4">
        <div
          class="w-full h-3 bg-amber-200 border border-amber-900 rounded font-quicksand overflow-hidden"
        >
          <div
            class="h-full bg-green-500 transition-all duration-300"
            :style="{ width: progressPercent + '%' }"
          />
        </div>

        <!-- Bundles + Image -->
        <div class="flex gap-6 items-start">
          <!-- Bundles (Left) -->
          <div class="flex-1 text-sm text-zinc-800 space-y-1">
            <div
              v-for="bundle in roomSection.bundles"
              :key="bundle.bundle.id"
              class="flex justify-start gap-2"
            >
              <span>{{ bundle.bundle.name }}</span>
              <span> ({{ bundle.progress.completed }} / {{ bundle.progress.required }}) </span>
            </div>
          </div>

          <!-- Image (Right) -->
          <div class="shrink-0">
            <img :src="roomImage" :alt="roomSection.room.name" class="max-h-40 object-contain" />
          </div>
        </div>

        <!-- Reward -->
        <div class="text-sm font-quicksand flex items-center gap-2">
          <strong>Reward:</strong>
          {{ roomSection.room.reward }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { RoomSection } from '@/types'

const props = defineProps<{
  roomSection: RoomSection
}>()

const isOpen = ref(true)

const progressPercent = computed(() => {
  const { completedBundles, totalBundles } = props.roomSection.progress
  if (!totalBundles) return 0
  return (completedBundles / totalBundles) * 100
})

const roomImage = computed(() => {
  const room = props.roomSection.room
  const isComplete = props.roomSection.progress.isComplete

  const file = isComplete ? room.imgAfter : room.imgBefore
  return `/images/rooms/${file}`
})
</script>
