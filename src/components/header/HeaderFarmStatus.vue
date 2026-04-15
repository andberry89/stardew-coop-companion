<template>
  <div class="absolute right-4 top-4 border-menu grad-amber px-4 py-2 rounded-lg text-sm space-y-2">
    <div class="space-y-1">
      <span class="font-bold">Players:</span>

      <div class="flex items-center gap-2">
        <div
          v-for="seat in 4"
          :key="seat"
          class="relative h-10 w-10 rounded-md border-item overflow-hidden bg-amber-100"
          :title="players[seat - 1]?.displayName ?? 'Empty slot'"
        >
          <img
            v-if="players[seat - 1]?.avatar"
            :src="`/images/avatars/${players[seat - 1]?.avatar + '-icon'}.png`"
            :alt="players[seat - 1]?.displayName ?? 'Player avatar'"
            class="h-full w-full object-contain pixel-art"
          />

          <div
            v-else
            class="flex h-full w-full items-center justify-center text-xs font-bold text-amber-900/60"
          >
            +
          </div>

          <span
            class="absolute bottom-1 right-1 h-2 w-2 rounded-full"
            :class="players[seat - 1] ? 'bg-green-500 animate-pulse' : 'bg-gray-400'"
          ></span>
        </div>
      </div>
    </div>

    <p>
      <span class="font-bold">Players:</span>
      <span :class="seatCount === 4 ? 'text-green-600' : 'text-yellow-800'">
        &nbsp;{{ seatCount }} / 4
      </span>
    </p>

    <p>
      <span class="font-bold">Farm:</span>
      &nbsp;{{ farmName }}
    </p>

    <p>
      <span class="font-bold">Code:</span>
      &nbsp;{{ farmCode }}
    </p>

    <p v-if="farmStatus === 'reconnecting'" class="text-yellow-400 text-xs animate-pulse">
      Reconnecting...
    </p>
  </div>
</template>

<script setup lang="ts">
type HeaderPlayer = {
  displayName: string
  avatar: string | null
}

defineProps<{
  players: HeaderPlayer[]
  seatCount: number
  farmName: string
  farmCode: string
  farmStatus: 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'full' | 'error'
}>()
</script>
