<template>
  <div class="max-w-md mx-auto mt-20 px-4">
    <div class="w-full max-w-md">
      <RouterLink to="/" class="block text-center mb-6">
        <img src="/images/main-logo.png" alt="Stardew Valley Logo" class="mx-auto mb-4 w-2/3" />
        <h1 class="text-lg font-stardew-bold text-white">CO-OP COMPANION</h1>
      </RouterLink>

      <div class="border-menu grad-green rounded-lg p-6 shadow-xl space-y-4 text-center">
        <h2 class="text-2xl font-stardew-bold text-green-950">Email Confirmed</h2>

        <p class="font-quicksand text-green-950">
          Your email has been confirmed and your account is ready.
        </p>

        <p class="font-quicksand text-green-950">
          You may close this window and return to the app.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
