<template>
  <nav class="border-menu grad-background flex gap-4 py-4 px-6 rounded-lg w-fit self-center">
    <button
      @click="$emit('update:modelValue', 'bundle')"
      :class="[
        'border-menu bg-amber-200 py-2 px-4 font-stardew-thin text-orange-950 transition-opacity duration-150',
        modelValue === 'bundle' ? 'opacity-100' : 'opacity-60 hover:opacity-80',
      ]"
    >
      Bundles
    </button>

    <button
      @click="$emit('update:modelValue', 'season')"
      :class="[
        'border-menu bg-amber-200 py-2 px-4 font-stardew-thin text-orange-950 transition-opacity duration-150',
        modelValue === 'season' ? 'opacity-100' : 'opacity-60 hover:opacity-80',
      ]"
    >
      Seasons
    </button>
  </nav>
</template>

<script setup lang="ts">
defineProps({
  modelValue: String,
})
</script>
