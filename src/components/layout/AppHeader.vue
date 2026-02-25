<template>
  <header class="relative flex items-center justify-center py-4">
    <!-- LEFT: MENU -->
    <div class="absolute left-4 top-4">
      <div class="border-menu grad-amber rounded-lg overflow-hidden w-56">
        <!-- Header Row -->
        <div
          class="flex items-center gap-2 px-4 py-2 cursor-pointer select-none"
          @click="menuOpen = !menuOpen"
        >
          <img
            v-if="currentAvatar"
            :src="`/images/avatars/${currentAvatar}-icon.png`"
            class="size-10 rounded border-2 border-yellow-900"
          />
          <span class="font-stardew-bold text-yellow-950">Menu</span>
        </div>

        <!-- Expanding Content -->
        <div
          class="transition-all duration-300 ease-in-out overflow-hidden"
          :class="menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'"
        >
          <div class="px-4 pb-3 space-y-2">
            <button
              class="w-full text-left hover:bg-yellow-200 px-2 py-1 rounded"
              @click="handleLeaveFarm"
            >
              Leave Farm
            </button>

            <button
              class="w-full text-left hover:bg-yellow-200 px-2 py-1 rounded"
              @click="openExport"
            >
              Export State
            </button>

            <button
              class="w-full text-left hover:bg-yellow-200 px-2 py-1 rounded"
              @click="openImport"
            >
              Import State
            </button>

            <button
              class="w-full text-left text-red-700 hover:bg-red-100 px-2 py-1 rounded"
              @click="logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- CENTER: LOGO -->
    <div class="text-center">
      <img src="/images/main-logo.png" alt="Stardew Valley Logo" class="mx-auto mb-4 w-2/3" />
      <h1 class="text-lg font-stardew-bold text-white">CO-OP COMPANION</h1>
    </div>

    <!-- RIGHT: FARM STATUS -->
    <div
      class="absolute right-4 top-4 border-menu grad-amber px-4 py-2 rounded-lg text-sm space-y-2"
    >
      <div class="flex items-center gap-2">
        <span class="font-bold">Partner:</span>

        <span v-if="partnerDisplayName" class="flex items-center gap-1">
          <span class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          {{ partnerDisplayName }}
        </span>

        <span v-else class="text-gray-400">Waiting...</span>
      </div>

      <p>
        <span class="font-bold">Players:</span>
        <span :class="seatCount === 2 ? 'text-green-400' : 'text-yellow-300'">
          &nbsp;{{ seatCount }} / 2
        </span>
      </p>

      <p>
        <span class="font-bold">Farm:</span>
        &nbsp;{{ farmName }}
      </p>

      <p>
        <span class="font-bold">Code:</span>
        &nbsp;{{ farmCode }}
      </p>

      <p v-if="store.farmStatus === 'reconnecting'" class="text-yellow-400 text-xs animate-pulse">
        Reconnecting...
      </p>
    </div>
  </header>
  <BaseModal v-if="modalType === 'export'" @close="modalType = null">
    <h2 class="text-xl font-stardew-bold text-orange-950 mb-2">Export State</h2>

    <textarea
      v-model="exportCode"
      readonly
      class="w-full border-menu bg-amber-50 p-3 text-xs h-40 resize-none rounded"
      aria-label="Exported state"
    />

    <div class="flex justify-end gap-2">
      <button
        class="border-menu grad-amber py-2 px-4 font-stardew-thin text-orange-950 stardew-btn"
        @click="modalType = null"
      >
        Close
      </button>

      <button
        class="border-menu grad-blue py-2 px-4 font-stardew-thin text-blue-950 stardew-btn"
        @click="copyExport"
      >
        Copy
      </button>
    </div>
  </BaseModal>

  <BaseModal v-if="modalType === 'import'" @close="modalType = null">
    <h2 class="text-xl font-stardew-bold text-orange-950 mb-2">Import State</h2>

    <textarea
      v-model="importInput"
      class="w-full border-menu p-2 text-xs h-36 bg-amber-50"
      placeholder="Paste state code here"
      aria-label="Import state"
    />

    <p v-if="importMessage" class="text-sm text-red-600 mt-2">
      {{ importMessage }}
    </p>

    <div class="flex justify-end gap-2 mt-3">
      <button
        class="border-menu grad-amber py-2 px-4 font-stardew-thin text-orange-950 stardew-btn"
        @click="modalType = null"
      >
        Close
      </button>

      <button
        class="border-menu grad-green py-2 px-4 font-stardew-thin text-green-950 stardew-btn"
        @click="runImport"
      >
        Import
      </button>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useBundlesStore } from '@/stores/bundles'
import { useRouter } from 'vue-router'
import BaseModal from '@/components/ui/BaseModal.vue'

const store = useBundlesStore()
const router = useRouter()

const menuOpen = ref(false)
const partnerDisplayName = ref<string | null>(null)
const currentUserId = ref<string | null>(null)
const currentAvatar = ref<string | null>(null)
const modalType = ref<'export' | 'import' | null>(null)
const exportCode = ref<string | null>(null)
const importInput = ref('')
const importMessage = ref<string | null>(null)

const farmName = computed(() => store.selectedFarm?.name ?? '')
const farmCode = computed(() => store.selectedFarm?.code ?? '')
const seatCount = computed(() => store.activeSessionUserIds.length)

async function disconnect() {
  await store.disconnectFromFarm()
  router.push('/account')
}

async function logout() {
  await store.disconnectFromFarm()
  await supabase.auth.signOut()
  router.push('/login')
}

function handleLeaveFarm() {
  menuOpen.value = false
  disconnect()
}

async function openExport() {
  menuOpen.value = false

  if (!store.currentFarmId) return

  const code = await store.exportStateCode()
  exportCode.value = code ?? ''
  modalType.value = 'export'
}

async function runImport() {
  importMessage.value = null

  try {
    await store.importStateCode(importInput.value)
    importMessage.value = 'State imported successfully.'
  } catch (err) {
    importMessage.value = err instanceof Error ? err.message : 'Import failed.'
  }
}

async function copyExport() {
  if (!exportCode.value) return
  await navigator.clipboard.writeText(exportCode.value)
}

function openImport() {
  menuOpen.value = false
  importInput.value = ''
  importMessage.value = null
  modalType.value = 'import'
}

onMounted(async () => {
  const { data } = await supabase.auth.getUser()
  currentUserId.value = data.user?.id ?? null

  if (data.user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar')
      .eq('id', data.user.id)
      .single()

    currentAvatar.value = profile?.avatar ?? null
  }
})

watch(
  () => store.activeSessionUserIds,
  async (ids) => {
    if (!currentUserId.value || ids.length < 2) {
      partnerDisplayName.value = null
      return
    }

    const partnerId = ids.find((id) => id !== currentUserId.value)
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
