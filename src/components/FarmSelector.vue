<template>
  <div class="p-4 space-y-2">
    <button class="px-3 py-2 bg-purple-600 text-white rounded" @click="createFarm">
      Create New Farm
    </button>
    <div v-for="farm in farms" :key="farm.id">
      <button
        class="px-3 py-2 rounded disabled:opacity-50"
        :class="store.currentFarmId === farm.id ? 'bg-green-400' : 'bg-gray-200'"
        :disabled="store.farmStatus === 'connecting'"
        @click="selectFarm(farm)"
      >
        {{ farm.name }} ({{ farm.code }})
      </button>

      <button class="px-3 py-2 bg-blue-500 text-white rounded" @click="exportCode">
        Export State
      </button>

      <p v-if="code" class="text-xs break-all mt-2">
        {{ code }}
      </p>

      <input
        v-model="importInput"
        class="border px-2 py-1 mt-2 w-full"
        placeholder="Paste state code here"
      />

      <button class="px-3 py-2 bg-purple-500 text-white rounded mt-2" @click="runImport">
        Import State
      </button>

      <button class="px-3 py-2 bg-red-500 text-white rounded" @click="store.disconnectFromFarm()">
        Disconnect
      </button>
    </div>
    <p v-if="store.farmStatus === 'full'" class="text-red-600 text-sm">
      Farm is full (2 players max). Try again later.
    </p>
    <p v-if="store.farmStatus === 'connecting'" class="text-gray-600 text-sm">Connecting...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getMyFarms } from '@/lib/farms'
import { useBundlesStore } from '@/stores/bundles'
import type { Farm } from '@/types'
import { supabase } from '@/lib/supabase'

const farms = ref<Farm[]>([])
const store = useBundlesStore()

const code = ref<string | null>(null)

async function exportCode() {
  code.value = await store.exportStateCode()
}

const importInput = ref('')

async function runImport() {
  await store.importStateCode(importInput.value)
}

onMounted(async () => {
  farms.value = await getMyFarms()
})

async function selectFarm(farm: Farm) {
  if (store.farmStatus === 'connecting') return
  await store.connectToFarm(farm)
}

async function createFarm() {
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return

  const code = Math.random().toString(36).substring(2, 8).toUpperCase()

  const { data, error } = await supabase
    .from('farms')
    .insert({
      name: 'My First Farm',
      code,
      created_by: userData.user.id,
    })
    .select()
    .single()

  if (error) {
    console.log('Farm insert error:', error)
    return
  }

  const { error: memberError } = await supabase.from('farm_members').insert({
    farm_id: data.id,
    user_id: userData.user.id,
    role: 'admin',
  })

  console.log('Farm created:', data, memberError)
}
</script>
