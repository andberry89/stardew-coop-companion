<template>
  <div class="border-4 border-green-900 grad-green rounded-lg p-6 space-y-4 shadow-md">
    <h2 class="text-xl font-stardew-bold text-green-950">Your Farms</h2>

    <div class="grid md:grid-cols-2 gap-4">
      <div
        v-for="farm in farms"
        :key="farm.id"
        class="bg-amber-50 border-menu rounded-lg p-4 space-y-3"
      >
        <div class="flex items-center gap-2">
          <div class="font-stardew-bold text-green-950 leading-none">
            {{ farm.name }}
          </div>

          <span
            v-if="farm.created_by === currentUserId"
            class="border-item grad-amber px-2 py-1 text-md leading-none font-quicksand text-orange-950 relative -top-px"
          >
            Owner
          </span>
        </div>

        <div class="text-md text-gray-600">Code: {{ farm.code }}</div>

        <button :disabled="connecting" :class="connectButtonClass" @click="emit('connect', farm)">
          Connect
        </button>

        <div v-if="isEditing" class="flex gap-2 pt-2">
          <button
            :disabled="leavingFarmId === farm.id"
            :class="leaveButtonClass"
            @click="emit('leave', farm.id)"
          >
            Leave
          </button>

          <button
            v-if="farm.created_by === currentUserId"
            :disabled="deleteFarmLoading"
            :class="deleteButtonClass"
            @click="emit('delete', farm.id)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Farm } from '@/types'

defineProps<{
  farms: Farm[]
  isEditing: boolean
  currentUserId: string | null
  leavingFarmId: string | null
  deleteFarmLoading: boolean
  connecting: boolean
}>()

const emit = defineEmits<{
  (e: 'connect', farm: Farm): void
  (e: 'leave', farmId: string): void
  (e: 'delete', farmId: string): void
}>()

const actionButtonClass =
  'border-menu py-2 px-3 font-stardew-thin stardew-btn text-xs disabled:opacity-50'

const leaveButtonClass = `${actionButtonClass} grad-amber text-orange-950`

const deleteButtonClass = `${actionButtonClass} grad-red text-red-950`

const connectButtonClass =
  'border-menu grad-green py-2 px-4 font-stardew-thin text-green-950 stardew-btn'
</script>
