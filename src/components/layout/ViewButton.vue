<template>
  <button @click="$emit('click')" :class="[base, active ? activeClass : inactiveClass]">
    <span>{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  active: boolean
}>()

defineEmits<{
  (e: 'click'): void
}>()

const base =
  'border-menu bg-amber-200 py-2 px-4 font-stardew-thin text-orange-950 transition-opacity duration-150  hover:cursor-pointer'
const activeClass = 'opacity-100'
const inactiveClass = 'opacity-60 hover:opacity-80'
</script>
