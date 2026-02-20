<template>
  <section class="space-y-6">
    <RoomCard
      v-for="roomSection in filteredRooms"
      :key="roomSection.room.id"
      :roomSection="roomSection"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useBundlesStore } from '@/stores/bundles'
import type { FilterState } from '@/types/filters'
import RoomCard from './RoomCard.vue'

const props = defineProps<{
  filters: FilterState
}>()

const store = useBundlesStore()

const filteredRooms = computed(() => {
  return store.bundlesByRoomView.filter((roomSection) => {
    const status = props.filters.roomStatus

    if (!status) return true

    return status === 'complete'
      ? roomSection.progress.isComplete
      : !roomSection.progress.isComplete
  })
})
</script>
