<template>
  <div
    class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50"
  >
    <div
      class="relative border-bundle grad-background text-left text-sm text-orange-950 px-3 py-2 rounded-md shadow-lg whitespace-nowrap"
    >
      <div v-for="source in sources" :key="source" class="leading-snug">
        {{ source }}
      </div>

      <!-- Arrow -->
      <div
        class="absolute left-1/2 -translate-x-1/2 top-full -mt-1.5 w-3 h-3 rotate-45 border-bundle grad-background"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { sources } = defineProps<{
  sources: string[]
}>()
</script>
