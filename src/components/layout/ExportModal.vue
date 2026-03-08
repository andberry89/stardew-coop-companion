<template>
  <BaseModal @close="emit('close')">
    <h2 class="text-xl font-stardew-bold text-orange-950 mb-2">Export State</h2>

    <textarea
      :value="exportCode ?? ''"
      readonly
      class="w-full border-menu bg-amber-50 p-3 text-xs h-40 resize-none rounded"
      aria-label="Exported state"
    />

    <div class="flex justify-end gap-2">
      <button
        class="border-menu grad-amber py-2 px-4 font-stardew-thin text-orange-950 stardew-btn"
        @click="emit('close')"
      >
        Close
      </button>

      <button
        :disabled="loading || !exportCode"
        class="border-menu grad-blue py-2 px-4 font-stardew-thin text-blue-950 stardew-btn disabled:opacity-50"
        @click="emit('copy')"
      >
        Copy
      </button>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/ui/BaseModal.vue'

defineProps<{
  exportCode: string | null
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'copy'): void
}>()
</script>
