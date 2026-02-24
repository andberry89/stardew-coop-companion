<template>
  <header class="relative flex items-center justify-center">
    <div class="text-center">
      <img src="/images/main-logo.png" alt="Stardew Valley Logo" class="mx-auto mb-4 w-2/3" />
      <h1 class="text-lg font-stardew-bold text-white">CO-OP COMPANION</h1>
    </div>

    <div
      class="border-menu grad-background absolute top-4 right-4 px-4 py-2 rounded-lg text-sm font-quicksand space-y-2"
    >
      <!-- Partner -->
      <div class="flex items-center gap-2">
        <span class="font-bold">Partner:</span>

        <span v-if="partnerName" class="flex items-center gap-1">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          {{ partnerDisplayName }}
        </span>

        <span v-else class="text-gray-400"> Waiting... </span>
        <p v-if="store.farmStatus === 'reconnecting'" class="text-yellow-400 text-xs animate-pulse">
          Reconnecting...
        </p>
      </div>
      <p>
        <span class="font-bold">Players:</span>
        <span :class="seatCount === 2 ? 'text-green-400' : 'text-yellow-300'">
          &nbsp;{{ seatCount }} / 2
        </span>
      </p>

      <!-- Farm -->
      <p>
        <span class="font-bold">Farm:</span>
        {{ farmName }}
      </p>

      <!-- Code -->
      <p>
        <span class="font-bold">Code:</span>
        {{ farmCode }}
      </p>

      <!-- Export -->
      <button class="text-xs bg-blue-600 text-white px-2 py-1 rounded" @click="generateExport">
        Export State
      </button>

      <p v-if="exportCode" class="text-xs break-all mt-1">
        {{ exportCode }}
      </p>

      <!-- Import -->
      <input
        v-model="importInput"
        class="border px-2 py-1 mt-2 w-full text-xs"
        placeholder="Paste state code"
      />

      <button class="text-xs bg-purple-600 text-white px-2 py-1 rounded mt-1" @click="runImport">
        Import State
      </button>

      <p v-if="importMessage" class="text-xs mt-1">
        {{ importMessage }}
      </p>

      <!-- Controls -->
      <div class="flex gap-2 pt-2">
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
import { computed, ref, watch } from 'vue'
import { supabase } from '@/lib/supabase'
import { useBundlesStore } from '@/stores/bundles'

const props = defineProps<{
  currentUserId: string | null
}>()

const store = useBundlesStore()

const exportCode = ref<string | null>(null)
const importInput = ref('')
const importMessage = ref<string | null>(null)
const partnerDisplayName = ref<string | null>(null)

const farmName = computed(() => store.selectedFarm?.name ?? '')
const farmCode = computed(() => store.selectedFarm?.code ?? '')
const seatCount = computed(() => {
  return store.activeSessionUserIds.length
})

const partnerName = computed(() => {
  if (!props.currentUserId) return null
  if (store.activeSessionUserIds.length < 2) return null

  const partnerId = store.activeSessionUserIds.find((id) => id !== props.currentUserId)

  return partnerId ? partnerId.slice(0, 8) : null
})

async function runImport() {
  importMessage.value = null

  try {
    await store.importStateCode(importInput.value)
    importMessage.value = 'State imported successfully.'
    importInput.value = ''
  } catch (err) {
    importMessage.value = err instanceof Error ? err.message : 'Import failed.'
  }
}

async function generateExport() {
  exportCode.value = await store.exportStateCode()
}

async function disconnect() {
  await store.disconnectFromFarm()
}

async function logout() {
  await store.disconnectFromFarm()
  await supabase.auth.signOut()
}

watch(
  () => store.activeSessionUserIds,
  async (ids) => {
    if (!props.currentUserId) {
      partnerDisplayName.value = null
      return
    }

    if (ids.length < 2) {
      partnerDisplayName.value = null
      return
    }

    const partnerId = ids.find((id) => id !== props.currentUserId)

    if (!partnerId) {
      partnerDisplayName.value = null
      return
    }

    const { data } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', partnerId)
      .single()

    partnerDisplayName.value = data?.display_name ?? null
  },
  { immediate: true },
)
</script>
