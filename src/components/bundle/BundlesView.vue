<template>
  <div class="space-y-4">
    <RoomSection
      v-for="roomSection in store.bundlesByRoomView"
      :key="roomSection.room.id"
      :room-section="roomSection"
      :selected-season="selectedSeason"
    />
  </div>
</template>

<script setup lang="ts">
import { useBundlesStore } from '@/stores/bundles'
import RoomSection from './RoomSection.vue'
import type { Season } from '@/types'

const { selectedSeason } = defineProps<{
  selectedSeason: Season | null
}>()
const store = useBundlesStore()
</script>
