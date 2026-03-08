<template>
  <header class="relative flex items-center justify-center py-4">
    <HeaderMenu
      :currentAvatar="currentAvatar"
      :exportLoading="exportLoading"
      :importLoading="importLoading"
      :logoutLoading="logoutLoading"
      @account="handleLeaveFarm"
      @export="openExport"
      @import="openImport"
      @logout="logout"
    />

    <HeaderLogo />

    <HeaderFarmStatus
      :partnerDisplayName="partnerDisplayName"
      :seatCount="seatCount"
      :farmName="farmName"
      :farmCode="farmCode"
      :farmStatus="store.farmStatus"
    />
  </header>

  <ExportModal
    v-if="modalType === 'export'"
    :exportCode="exportCode"
    :loading="exportLoading"
    @close="modalType = null"
    @copy="copyExport"
  />

  <ImportModal
    v-if="modalType === 'import'"
    v-model="importInput"
    :loading="importLoading"
    @close="modalType = null"
    @import="runImport"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { useBundlesStore } from '@/stores/bundles'
import { useRouter } from 'vue-router'
import HeaderMenu from '@/components/layout/HeaderMenu.vue'
import HeaderLogo from '@/components/layout/HeaderLogo.vue'
import HeaderFarmStatus from '@/components/layout/HeaderFarmStatus.vue'
import ExportModal from '@/components/layout/ExportModal.vue'
import ImportModal from '@/components/layout/ImportModal.vue'
import { useToast } from '@/composables/useToast'

const store = useBundlesStore()
const router = useRouter()
const toast = useToast()

const partnerDisplayName = ref<string | null>(null)
const currentUserId = ref<string | null>(null)
const currentAvatar = ref<string | null>(null)
const modalType = ref<'export' | 'import' | null>(null)
const exportCode = ref<string | null>(null)
const exportLoading = ref(false)
const importLoading = ref(false)
const logoutLoading = ref(false)
const importInput = ref('')

const farmName = computed(() => store.selectedFarm?.name ?? '')
const farmCode = computed(() => store.selectedFarm?.code ?? '')
const seatCount = computed(() => store.activeSessionUserIds.length)

async function disconnect() {
  await store.disconnectFromFarm()
  router.push('/account')
}

async function logout() {
  if (logoutLoading.value) return

  logoutLoading.value = true

  try {
    await supabase.auth.signOut()
  } finally {
    logoutLoading.value = false
  }
}

async function handleLeaveFarm() {
  await disconnect()
}

async function openExport() {
  if (exportLoading.value) return

  exportLoading.value = true

  try {
    if (!store.currentFarmId) return

    const code = await store.exportStateCode()
    exportCode.value = code ?? ''
    modalType.value = 'export'
  } finally {
    exportLoading.value = false
  }
}

async function runImport() {
  if (importLoading.value) return

  importLoading.value = true

  try {
    await store.importStateCode(importInput.value)
    toast.success('State imported')
    modalType.value = null
    importInput.value = ''
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Import failed')
  } finally {
    importLoading.value = false
  }
}

async function copyExport() {
  if (!exportCode.value) return

  try {
    await navigator.clipboard.writeText(exportCode.value)
    toast.success('State copied')
    return
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = exportCode.value
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'absolute'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()

    const didCopy = document.execCommand('copy')
    document.body.removeChild(textarea)

    if (didCopy) {
      toast.success('State copied')
    } else {
      toast.error('Copy failed')
    }
  }
}

function openImport() {
  importInput.value = ''
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
