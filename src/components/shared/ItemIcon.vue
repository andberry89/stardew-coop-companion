<template>
  <div class="relative bg-orange-300 border-item size-14 flex justify-center items-center">
    <img :src="src" alt="" />

    <!-- Quality -->
    <img
      v-if="minQuality"
      :src="qualityIconFor(minQuality)"
      alt="Quality"
      class="absolute bottom-0 left-0 size-8"
    />

    <!-- Quantity -->
    <div
      v-if="requiredPerSubmission > 1"
      class="absolute bottom-0 right-0 bg-[rgba(0,0,0,0.7)] text-white text-xs font-bold px-0.5 rounded"
    >
      x{{ requiredPerSubmission }}
    </div>

    <!-- Completed -->
    <img
      v-if="completed"
      src="/images/icons/golden-scroll.png"
      class="absolute inset-0 m-auto size-10"
      alt="Completed"
    />
  </div>
</template>

<script setup lang="ts">
import { qualityIconFor } from '@/utils/quality'

const { src, minQuality, requiredPerSubmission, completed } = defineProps<{
  src: string
  minQuality?: string
  requiredPerSubmission?: number
  completed?: boolean
}>()
</script>
