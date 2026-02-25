<template>
  <nav class="border-menu grad-amber flex gap-4 py-4 px-6 rounded-lg w-fit self-center">
    <ViewButton
      v-for="option in VIEW_OPTIONS"
      :key="option.key"
      :label="option.label"
      :active="props.modelValue === option.key"
      @click="emit('update:modelValue', option.key)"
    />
  </nav>
</template>

<script setup lang="ts">
import type { ViewStatus } from '@/types'
import { VIEW_OPTIONS } from '@/constants/views'
import ViewButton from './ViewButton.vue'

const props = defineProps<{
  modelValue: ViewStatus
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ViewStatus): void
}>()
</script>
