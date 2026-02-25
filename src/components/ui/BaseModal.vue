<template>
  <div
    class="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
    @click.self="$emit('close')"
  >
    <div class="border-menu grad-amber rounded-lg w-full max-w-lg p-6 shadow-2xl space-y-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['close'])
</script>
