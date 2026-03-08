<template>
  <BaseModal @close="emit('close')">
    <h2 class="text-xl font-stardew-bold text-orange-950 mb-2">Import State</h2>

    <textarea
      :value="modelValue"
      class="w-full border-menu p-2 text-xs h-36 bg-amber-50"
      placeholder="Paste state code here"
      aria-label="Import state"
      @input="handleInput"
    />

    <div class="flex justify-end gap-2 mt-3">
      <button
        class="border-menu grad-amber py-2 px-4 font-stardew-thin text-orange-950 stardew-btn"
        @click="emit('close')"
      >
        Close
      </button>

      <button
        :disabled="loading || !modelValue.trim()"
        class="border-menu grad-green py-2 px-4 font-stardew-thin text-green-950 stardew-btn disabled:opacity-50"
        @click="emit('import')"
      >
        Import
      </button>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import BaseModal from '@/components/ui/BaseModal.vue'

defineProps<{
  modelValue: string
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'import'): void
  (e: 'update:modelValue', value: string): void
}>()

function handleInput(event: Event) {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>
