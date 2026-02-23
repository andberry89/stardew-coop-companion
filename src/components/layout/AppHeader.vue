<template>
  <header class="relative flex items-center justify-center">
    <div class="text-center">
      <img src="/images/main-logo.png" alt="Stardew Valley Logo" class="mx-auto mb-4 w-2/3" />
      <h1 class="text-lg font-stardew-bold text-white">CO-OP COMPANION</h1>
    </div>

    <div
      class="border-menu grad-background absolute top-4 right-4 px-4 py-2 rounded-lg text-sm font-quicksand space-y-1"
    >
      <p>
        <span class="font-bold">Partner:</span>
        {{ isPartnerConnected ? 'Connected' : 'Waiting...' }}
      </p>
      <p>
        <span class="font-bold">Farm:</span>
        {{ farmName }}
      </p>

      <p>
        <span class="font-bold">Code:</span>
        {{ farmCode }}
      </p>

      <div class="flex gap-2 pt-1">
        <button class="text-xs bg-gray-700 text-white px-2 py-1 rounded" @click="disconnect">
          Leave Farm
        </button>

        <button class="text-xs bg-red-600 text-white px-2 py-1 rounded" @click="logout">
          Logout
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useBundlesStore } from '@/stores/bundles'

const store = useBundlesStore()

const farmName = computed(() => store.selectedFarm?.name ?? '')
const farmCode = computed(() => store.selectedFarm?.code ?? '')

const isPartnerConnected = computed(() => {
  return store.activeSessionUserIds.length > 1
})

async function disconnect() {
  await store.disconnectFromFarm()
}

async function logout() {
  await store.disconnectFromFarm()
  await supabase.auth.signOut()
}
</script>
