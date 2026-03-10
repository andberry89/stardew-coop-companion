<template>
  <BaseModal @close="emit('close')">
    <h2 class="text-xl font-stardew-bold text-orange-950 mb-3">Delete Account</h2>

    <p class="text-md text-orange-950">
      This will permanently delete your account and remove the farms you own.
    </p>

    <p class="text-md text-orange-950">This cannot be undone.</p>

    <div class="flex justify-end gap-2 mt-3">
      <button
        class="border-menu grad-amber py-2 px-4 font-stardew-thin text-orange-950 stardew-btn"
        @click="emit('close')"
      >
        Cancel
      </button>

      <button
        :disabled="loading"
        class="border-menu grad-red py-2 px-4 font-stardew-thin text-red-950 stardew-btn disabled:opacity-50"
        @click="emit('confirm')"
      >
        {{ loading ? 'Loading...' : 'Delete Account' }}
      </button>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/ui/BaseModal.vue'

defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'confirm'): void
}>()
</script>
