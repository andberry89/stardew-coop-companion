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
        <div v-if="farmMembersByFarmId[farm.id]?.length" class="pt-2">
          <div class="flex flex-wrap gap-3">
            <div
              v-for="member in farmMembersByFarmId[farm.id]"
              :key="member.user_id"
              class="flex w-16 flex-col items-center gap-1 text-center"
            >
              <div
                class="h-12 w-12 rounded-md border-item overflow-hidden bg-amber-100"
                :title="member.profiles?.display_name ?? 'Unknown Farmer'"
              >
                <img
                  v-if="member.profiles?.avatar"
                  :src="`/images/avatars/${member.profiles.avatar}-icon.png`"
                  :alt="member.profiles?.display_name ?? 'Unknown Farmer'"
                  class="h-full w-full object-contain pixel-art"
                />

                <div
                  v-else
                  class="flex h-full w-full items-center justify-center text-xs text-amber-900/60"
                >
                  ?
                </div>
              </div>

              <div class="text-xs leading-tight text-green-950">
                {{ member.profiles?.display_name ?? 'Unknown Farmer' }}
              </div>
            </div>
          </div>
        </div>

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
defineProps<{
  farms: Farm[]
  farmMembersByFarmId: Record<
    string,
    {
      user_id: string
      role: string
      profiles: {
        display_name: string | null
        avatar: string | null
      } | null
    }[]
  >
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
