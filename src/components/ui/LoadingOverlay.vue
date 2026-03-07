<template>
  <div
    class="fixed inset-0 z-40 flex items-center justify-center bg-black/35 backdrop-blur-sm px-4"
  >
    <div class="border-menu grad-amber rounded-lg p-6 w-full max-w-md text-center shadow-xl">
      <h2 class="text-2xl font-stardew-bold text-orange-950">
        {{ title }}
      </h2>

      <p class="mt-6 text-orange-900 font-stardew-bold">
        {{ message }}
      </p>

      <div class="mt-4 flex justify-center">
        <img src="/images/junimo.gif" alt="Junimo loading" class="w-20 h-20 junimo-float" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  message: string
}>()
</script>
<style scoped>
.junimo-float {
  image-rendering: pixelated;
  animation: junimo-float 2s ease-in-out infinite;
}

@keyframes junimo-float {
  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-6px);
  }
}
</style>
