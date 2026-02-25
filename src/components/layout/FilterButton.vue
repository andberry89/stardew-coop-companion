<template>
  <button @click="$emit('click')" :class="[base, active ? activeClass : inactiveClass]">
    <img v-if="icon" :src="icon" :alt="label" class="w-6 h-6" />
    <span>{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  icon?: string
  active: boolean
}>()

defineEmits<{
  (e: 'click'): void
}>()

const base =
  'border-menu bg-amber-200 p-1 flex items-center gap-2 mb-1 w-full transition-all duration-150 text-md '

const activeClass = 'opacity-100 scale-105 border-2 border-orange-500'
const inactiveClass = 'opacity-40 hover:opacity-60'
</script>
