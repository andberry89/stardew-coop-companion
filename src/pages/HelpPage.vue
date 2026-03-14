<template>
  <div class="max-w-5xl mx-auto p-6 space-y-6">
    <div class="flex items-center">
      <RouterLink
        :to="homeRoute"
        class="border-menu grad-blue px-3 py-2 font-stardew-thin text-blue-950 stardew-btn"
      >
        ← Go Back
      </RouterLink>
    </div>
    <div class="border-menu grad-amber rounded-lg p-6 shadow-xl space-y-3">
      <h1 class="text-3xl font-stardew-bold text-orange-950">Help & Support</h1>
      <p class="font-quicksand text-orange-950">
        Need to report a bug, suggest an improvement, or learn how state codes work? This page
        covers the basics.
      </p>
    </div>

    <div class="border-menu grad-green rounded-lg p-6 shadow-xl space-y-4">
      <h2 class="text-2xl font-stardew-bold text-green-950">Bug Reports & Suggestions</h2>

      <div class="space-y-2 font-quicksand text-green-950">
        <p>
          Send bug reports or feature suggestions to:
          <a href="mailto:support@andrewberry.me" class="underline underline-offset-2 font-bold">
            support@andrewberry.me
          </a>
        </p>

        <p>Helpful details to include:</p>

        <ul class="list-disc pl-5 space-y-1">
          <li>What happened</li>
          <li>What you expected to happen</li>
          <li>Screenshots, if helpful</li>
          <li>Your farm code, if the issue is farm-specific</li>
        </ul>
        <p class="text-sm font-quicksand text-green-950">You can also open an issue on GitHub.</p>
      </div>
    </div>

    <div class="border-menu grad-amber rounded-lg p-6 shadow-xl space-y-4">
      <h2 class="text-2xl font-stardew-bold text-orange-950">What Is a State Code?</h2>

      <div class="space-y-3 font-quicksand text-orange-950">
        <p>A state code is a shareable snapshot of your farm’s Community Center bundle progress.</p>
        <p>
          You can use it to move progress, restore progress, or copy a known bundle state into a
          farm.
        </p>
        <p>
          A <strong>state code</strong> is different from a <strong>farm code</strong>. Farm codes
          are for joining farms. State codes are for bundle progress.
        </p>
      </div>
    </div>

    <div class="border-menu grad-blue rounded-lg p-6 shadow-xl space-y-4">
      <h2 class="text-2xl font-stardew-bold text-blue-950">How to Use State Codes</h2>

      <div class="grid md:grid-cols-2 gap-6 font-quicksand text-blue-950">
        <div class="space-y-2">
          <h3 class="font-stardew-bold text-lg">Export</h3>
          <ol class="list-decimal pl-5 space-y-1">
            <li>Open your farm</li>
            <li>Open the menu</li>
            <li>Select <strong>Export State</strong></li>
            <li>Copy and save the code somewhere safe</li>
          </ol>
        </div>

        <div class="space-y-2">
          <h3 class="font-stardew-bold text-lg">Import</h3>
          <ol class="list-decimal pl-5 space-y-1">
            <li>Open your farm</li>
            <li>Open the menu</li>
            <li>Select <strong>Import State</strong></li>
            <li>Paste the code and import it</li>
          </ol>
        </div>
      </div>
    </div>

    <div class="border-menu grad-red rounded-lg p-6 shadow-xl space-y-2">
      <h2 class="text-2xl font-stardew-bold text-red-950">Important Note</h2>
      <p class="font-quicksand text-red-950">
        Importing a state code <strong>replaces</strong> the farm’s current bundle progress state.
      </p>
    </div>
    <div class="border-menu grad-amber rounded-lg p-6 shadow-xl space-y-3">
      <h2 class="text-2xl font-stardew-bold text-orange-950">Project</h2>

      <p class="font-quicksand text-orange-950">
        This project is open source. You can view the code, report issues, or suggest improvements
        on GitHub.
      </p>

      <a
        href="https://github.com/andberry89/stardew-coop-companion"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-block border-menu grad-blue px-4 py-2 font-stardew-thin text-blue-950 stardew-btn"
      >
        View on GitHub
      </a>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { supabase } from '@/lib/supabase'

const homeRoute = ref('/login')

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  if (data.user) {
    homeRoute.value = '/account'
  }
})
</script>
