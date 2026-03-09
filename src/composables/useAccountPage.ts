import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { getMyFarms, getFarmByCode, type Farm } from '@/lib/farms'
import { getProfile, updateProfile } from '@/lib/profiles'
import { useBundlesStore } from '@/stores/bundles'
import { useToast } from '@/composables/useToast'

export function useAccountPage() {
  const router = useRouter()
  const store = useBundlesStore()
  const toast = useToast()

  const email = ref<string | null>(null)
  const displayName = ref('')
  const farms = ref<Farm[]>([])
  const isEditing = ref(false)
  const avatar = ref<string | null>(null)
  const newFarmName = ref('')
  const joinCode = ref('')
  const farmError = ref<string | null>(null)
  const currentUserId = ref<string | null>(null)
  const farmPendingDelete = ref<string | null>(null)
  const logoutLoading = ref(false)
  const saveProfileLoading = ref(false)
  const createFarmLoading = ref(false)
  const joinFarmLoading = ref(false)
  const leavingFarmId = ref<string | null>(null)
  const deleteFarmLoading = ref(false)
  const connectingFarmId = ref<string | null>(null)

  const avatarOptions = [
    'abigail',
    'alex',
    'caroline',
    'clint',
    'elliott',
    'emily',
    'evelyn',
    'gus',
    'haley',
    'harvey',
    'kent',
    'krobus',
    'leah',
    'leo',
    'linus',
    'marnie',
    'maru',
    'penny',
    'pierre',
    'robin',
    'sam',
    'sandy',
    'sebastian',
    'shane',
    'vincent',
    'willy',
    'wizard',
  ]

  onMounted(async () => {
    const { data } = await supabase.auth.getUser()
    currentUserId.value = data.user?.id ?? null
    email.value = data.user?.email ?? null

    if (data.user) {
      const profile = await getProfile(data.user.id)
      displayName.value = profile?.display_name ?? ''
      avatar.value = profile?.avatar ?? null
    }

    farms.value = await getMyFarms()
    const lastFarmId = localStorage.getItem('lastFarmId')

    if (lastFarmId) {
      const farm = farms.value.find((f) => f.id === lastFarmId)

      if (farm) {
        await store.connectToFarm(farm)
        await router.push(`/farm/${farm.code}`)
      }
    }
  })

  async function logout() {
    if (logoutLoading.value) return

    logoutLoading.value = true

    try {
      if (store.currentFarmId) {
        await store.disconnectFromFarm()
      }

      await supabase.auth.signOut()
    } finally {
      logoutLoading.value = false
    }
  }

  async function saveProfile() {
    if (saveProfileLoading.value) return

    const trimmed = displayName.value.trim()
    if (!trimmed) return

    saveProfileLoading.value = true

    try {
      const { data } = await supabase.auth.getUser()
      if (!data.user) return

      const { error } = await updateProfile(data.user.id, {
        display_name: trimmed,
        avatar: avatar.value,
      })

      if (error) {
        toast.error('Failed to save profile')
        return
      }

      isEditing.value = false
      toast.success('Profile updated')
    } finally {
      saveProfileLoading.value = false
    }
  }

  function cancelEdit() {
    isEditing.value = false
  }

  async function createFarm() {
    if (createFarmLoading.value) return

    farmError.value = null
    createFarmLoading.value = true

    try {
      const { data } = await supabase.auth.getUser()
      if (!data.user) return

      const name = newFarmName.value.trim()

      if (!name) {
        farmError.value = 'Farm name cannot be empty.'
        return
      }

      if (name.length > 40) {
        farmError.value = 'Farm name must be 40 characters or fewer.'
        return
      }

      const code = Math.random().toString(36).substring(2, 8).toUpperCase()

      const { data: farm, error } = await supabase
        .from('farms')
        .insert({
          name,
          code,
          created_by: data.user.id,
        })
        .select()
        .single()

      if (error || !farm) {
        farmError.value = 'Failed to create farm.'
        toast.error('Failed to create farm')
        return
      }

      await supabase.from('farm_members').insert({
        farm_id: farm.id,
        user_id: data.user.id,
        role: 'admin',
      })

      farms.value = await getMyFarms()
      newFarmName.value = ''
      toast.success('Farm created')
    } finally {
      createFarmLoading.value = false
    }
  }

  async function connectToFarm(farm: Farm) {
    if (connectingFarmId.value) return

    connectingFarmId.value = farm.id

    try {
      await store.connectToFarm(farm)

      if (store.farmStatus === 'full') {
        toast.error('Farm is full')
        return
      }

      if (store.farmStatus === 'error') {
        toast.error('Failed to connect to farm')
        return
      }

      await router.push(`/farm/${farm.code}`)
    } finally {
      connectingFarmId.value = null
    }
  }

  async function joinFarm() {
    if (joinFarmLoading.value) return

    joinFarmLoading.value = true

    try {
      const farm = await getFarmByCode(joinCode.value.trim().toUpperCase())

      if (!farm) {
        toast.error('Invalid farm code')
        return
      }

      const { data } = await supabase.auth.getUser()
      if (!data.user) return

      const { error } = await supabase.from('farm_members').insert({
        farm_id: farm.id,
        user_id: data.user.id,
        role: 'member',
      })

      if (error) {
        toast.error('Failed to join farm')
        return
      }

      farms.value = await getMyFarms()
      joinCode.value = ''
      toast.success('Joined farm')
    } catch (err) {
      console.error('joinFarm error:', err)
      toast.error('Unable to look up farm code')
    } finally {
      joinFarmLoading.value = false
    }
  }

  async function leaveFarm(farmId: string) {
    if (leavingFarmId.value) return
    if (!currentUserId.value) return

    leavingFarmId.value = farmId

    try {
      const { error } = await supabase.from('farm_members').delete().match({
        farm_id: farmId,
        user_id: currentUserId.value,
      })

      if (error) {
        toast.error('Failed to leave farm')
        return
      }

      if (store.currentFarmId === farmId) {
        await store.disconnectFromFarm()
        await router.push('/account')
      }

      farms.value = await getMyFarms()
      toast.success('Left farm')
    } finally {
      leavingFarmId.value = null
    }
  }

  async function deleteFarm(farmId: string) {
    if (!currentUserId.value) return

    const farm = farms.value.find((item) => item.id === farmId)
    if (!farm) return

    if (farm.created_by !== currentUserId.value) return

    if (store.currentFarmId === farmId) {
      await store.disconnectFromFarm()
    }

    const { error: memberError } = await supabase.from('farm_members').delete().match({
      farm_id: farmId,
      user_id: currentUserId.value,
    })

    if (memberError) {
      toast.error('Failed to delete farm')
      return
    }

    const { error: sessionError } = await supabase
      .from('farm_sessions')
      .delete()
      .eq('farm_id', farmId)

    if (sessionError) {
      toast.error('Failed to delete farm')
      return
    }

    const { error: farmDeleteError } = await supabase.from('farms').delete().eq('id', farmId)

    if (farmDeleteError) {
      toast.error('Failed to delete farm')
      return
    }

    farms.value = await getMyFarms()
    toast.success('Farm deleted')
  }

  async function confirmDelete() {
    if (!farmPendingDelete.value || deleteFarmLoading.value) return

    deleteFarmLoading.value = true

    try {
      await deleteFarm(farmPendingDelete.value)
      farmPendingDelete.value = null
    } finally {
      deleteFarmLoading.value = false
    }
  }

  return {
    email,
    displayName,
    farms,
    isEditing,
    avatar,
    newFarmName,
    joinCode,
    farmError,
    currentUserId,
    farmPendingDelete,
    logoutLoading,
    saveProfileLoading,
    createFarmLoading,
    joinFarmLoading,
    leavingFarmId,
    deleteFarmLoading,
    connectingFarmId,
    avatarOptions,
    logout,
    saveProfile,
    cancelEdit,
    createFarm,
    connectToFarm,
    joinFarm,
    leaveFarm,
    confirmDelete,
  }
}
