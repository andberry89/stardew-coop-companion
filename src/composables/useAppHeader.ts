import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { getProfileAvatar, getProfileDisplayName } from '@/lib/profiles'
import { getStateCodeErrorMessage } from '@/lib/bundles/stateCode'
import { getErrorMessage, logError } from '@/lib/errors'
import { disconnectCurrentFarmIfNeeded, logoutWithFarmDisconnect } from '@/lib/session'
import { useBundlesStore } from '@/stores/bundles'
import { useToast } from '@/composables/useToast'

export function useAppHeader() {
  const store = useBundlesStore()
  const router = useRouter()
  const toast = useToast()

  // ─────────────────────────────
  // Header State
  // ─────────────────────────────
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

  // ─────────────────────────────
  // Session Actions
  // ─────────────────────────────
  async function disconnect() {
    try {
      await disconnectCurrentFarmIfNeeded()
      await router.push('/account')
    } catch (error) {
      logError('disconnect failed', error)
      toast.error(getErrorMessage(error, 'Failed to leave farm'))
    }
  }

  async function logout() {
    if (logoutLoading.value) return

    logoutLoading.value = true

    try {
      await logoutWithFarmDisconnect()
    } catch (error) {
      logError('logout failed', error)
      toast.error(getErrorMessage(error, 'Logout failed'))
    } finally {
      logoutLoading.value = false
    }
  }

  async function handleLeaveFarm() {
    await disconnect()
  }

  // ─────────────────────────────
  // Import / Export Actions
  // ─────────────────────────────
  async function openExport() {
    if (exportLoading.value) return
    if (!store.currentFarmId) return

    exportLoading.value = true

    try {
      const code = await store.exportStateCode()
      exportCode.value = code ?? ''
      modalType.value = 'export'
    } finally {
      exportLoading.value = false
    }
  }

  function openImport() {
    importInput.value = ''
    modalType.value = 'import'
  }

  async function runImport() {
    if (importLoading.value) return

    importLoading.value = true

    try {
      await store.importStateCode(importInput.value)
      toast.success('State imported')
      modalType.value = null
      importInput.value = ''
    } catch (error) {
      logError('runImport failed', error)
      toast.error(getStateCodeErrorMessage(error))
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
      // Fallback for browsers where the clipboard API is unavailable or blocked.
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

  // ─────────────────────────────
  // Bootstrap
  // ─────────────────────────────
  onMounted(async () => {
    await initializeHeader()
  })

  async function initializeHeader() {
    const { data } = await supabase.auth.getUser()
    currentUserId.value = data.user?.id ?? null

    if (!data.user) {
      return
    }

    currentAvatar.value = await getProfileAvatar(data.user.id)
  }

  // ─────────────────────────────
  // Partner Presence
  // ─────────────────────────────
  watch(
    () => store.activeSessionUserIds,
    async (ids) => {
      if (!currentUserId.value || ids.length < 2) {
        partnerDisplayName.value = null
        return
      }

      // In co-op, show the other active player when a second session is connected.
      const partnerId = ids.find((id) => id !== currentUserId.value)
      if (!partnerId) {
        partnerDisplayName.value = null
        return
      }

      partnerDisplayName.value = await getProfileDisplayName(partnerId)
    },
    { immediate: true },
  )

  return {
    store,
    partnerDisplayName,
    currentAvatar,
    modalType,
    exportCode,
    exportLoading,
    importLoading,
    logoutLoading,
    importInput,
    farmName,
    farmCode,
    seatCount,
    handleLeaveFarm,
    logout,
    openExport,
    openImport,
    runImport,
    copyExport,
  }
}
