<template>
  <div class="space-y-4">
    <RoomSection
      v-for="roomSection in store.bundlesByRoomView"
      :key="roomSection.room.id"
      :room-section="roomSection"
      :selected-season="props.selectedSeason"
    />
  </div>
</template>

<script setup lang="ts">
import { useBundlesStore } from '@/stores/bundles'
import RoomSection from './RoomSection.vue'

const props = defineProps({
  selectedSeason: String,
})

const store = useBundlesStore()
</script>
