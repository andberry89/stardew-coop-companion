<template>
  <div class="absolute right-4 top-4 border-menu grad-amber px-4 py-2 rounded-lg text-sm space-y-2">
    <div class="flex items-center gap-2">
      <span class="font-bold">Partner:</span>

      <span v-if="partnerDisplayName" class="flex items-center gap-1">
        <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
        {{ partnerDisplayName }}
      </span>

      <span v-else class="text-gray-400">Waiting...</span>
    </div>

    <p>
      <span class="font-bold">Players:</span>
      <span :class="seatCount === 2 ? 'text-green-600' : 'text-yellow-300'">
        &nbsp;{{ seatCount }} / 2
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
defineProps<{
  partnerDisplayName: string | null
  seatCount: number
  farmName: string
  farmCode: string
  farmStatus: 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'full' | 'error'
}>()
</script>
