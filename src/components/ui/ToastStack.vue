<template>
  <div class="fixed top-4 right-4 z-100 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      class="border-menu rounded-lg px-4 py-3 shadow-xl text-sm font-stardew-bold pointer-events-auto"
      :class="toastClass(toast.type)"
    >
      <div class="flex items-start justify-between gap-3">
        <span>{{ toast.message }}</span>

        <button class="text-current opacity-70 hover:opacity-100" @click="remove(toast.id)">
          X
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'

const { toasts, remove } = useToast()

function toastClass(type: 'success' | 'error' | 'info') {
  if (type === 'success') {
    return 'grad-green text-green-950'
  }

  if (type === 'error') {
    return 'grad-red text-red-950'
  }

  return 'grad-blue text-blue-950'
}
</script>
