<template>
  <div class="space-y-10">
    <RoomSection
      v-for="roomSection in store.bundlesByRoomView"
      :key="roomSection.room.id"
      :room-section="roomSection"
    />
  </div>
</template>

<script setup lang="ts">
import { useBundlesStore } from '@/stores/bundles'
import RoomSection from './RoomSection.vue'

const store = useBundlesStore()
</script>
