<template>
  <div class="max-w-6xl mx-auto p-6 space-y-8">
    <!-- PROFILE PANEL -->
    <div class="border-4 border-yellow-800 grad-amber rounded-lg p-6 space-y-6 shadow-md">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-stardew-bold text-orange-950">Farmer Profile</h1>

        <div class="flex gap-2">
          <button
            v-if="!isEditing"
            class="border-menu grad-amber py-2 px-4 font-stardew-thin text-orange-950 stardew-btn"
            @click="isEditing = true"
          >
            Edit
          </button>

          <button
            class="border-menu grad-red py-2 px-4 font-stardew-thin text-red-950 stardew-btn"
            @click="logout"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- VIEW MODE -->
      <div v-if="!isEditing" class="flex items-center gap-6">
        <img
          v-if="avatar"
          :src="`/images/avatars/${avatar}-portrait.png`"
          class="w-24 h-24 rounded border-4 border-yellow-900"
        />

        <div>
          <div class="text-xl font-stardew-bold text-orange-950">
            {{ displayName || 'Unnamed Farmer' }}
          </div>

          <div class="text-sm text-orange-900">
            {{ email }}
          </div>
        </div>
      </div>

      <!-- EDIT MODE -->
      <div v-else class="space-y-4">
        <div>
          <label class="block text-sm font-stardew-bold text-orange-950 mb-1"> Display Name </label>
          <input v-model="displayName" class="border-menu bg-amber-50 rounded px-3 py-2 w-full" />
        </div>

        <div>
          <label class="block text-sm font-stardew-bold text-orange-950 mb-2"> Avatar </label>

          <div class="grid grid-cols-6 gap-3">
            <img
              v-for="name in avatarOptions"
              :key="name"
              :src="`/images/avatars/${name}-portrait.png`"
              class="size-20 rounded cursor-pointer border-4 transition-all duration-150 hover:scale-110"
              :class="
                avatar === name
                  ? 'border-green-700 scale-110'
                  : 'border-yellow-800 hover:border-green-600'
              "
              @click="avatar = name"
            />
          </div>
        </div>

        <div class="flex gap-3">
          <button
            class="border-menu grad-green py-2 px-4 font-stardew-thin text-green-950 stardew-btn"
            @click="saveProfile"
          >
            Save
          </button>

          <button
            class="border-menu grad-amber py-2 px-4 font-stardew-thin text-orange-950 stardew-btn"
            @click="cancelEdit"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- FARMS PANEL -->
    <div class="border-4 border-green-900 grad-green rounded-lg p-6 space-y-4 shadow-md">
      <h2 class="text-xl font-stardew-bold text-green-950">Your Farms</h2>

      <div class="grid md:grid-cols-2 gap-4">
        <div
          v-for="farm in farms"
          :key="farm.id"
          class="bg-amber-50 border-menu rounded-lg p-4 space-y-3"
        >
          <div class="font-stardew-bold text-green-950">
            {{ farm.name }}
          </div>

          <div class="text-md text-gray-600">Code: {{ farm.code }}</div>

          <button
            class="border-menu grad-green py-2 px-4 font-stardew-thin text-green-950 stardew-btn"
            @click="connectToFarm(farm)"
          >
            Connect
          </button>

          <div v-if="isEditing" class="flex gap-2 pt-2">
            <button
              class="border-menu grad-amber py-2 px-3 font-stardew-thin text-orange-950 stardew-btn text-xs"
              @click="leaveFarm(farm.id)"
            >
              Leave
            </button>

            <button
              v-if="farm.created_by === currentUserId"
              class="border-menu grad-red py-2 px-3 font-stardew-thin text-red-950 stardew-btn text-xs"
              @click="farmPendingDelete = farm.id"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- MANAGE PANEL -->
    <div class="border-4 border-blue-900 grad-blue rounded-lg p-6 space-y-6 shadow-md">
      <h2 class="text-xl font-stardew-bold text-blue-950">Manage Farms</h2>

      <div class="grid md:grid-cols-2 gap-6">
        <!-- Create -->
        <div class="space-y-3">
          <h3 class="font-stardew-bold text-blue-950">Create Farm</h3>

          <input
            v-model="newFarmName"
            placeholder="Farm name"
            class="border-menu bg-blue-50 rounded px-3 py-2 w-full"
          />

          <button
            class="border-menu grad-blue py-2 px-4 font-stardew-thin text-blue-950 stardew-btn"
            @click="createFarm"
          >
            Create
          </button>

          <p v-if="farmError" class="text-sm text-red-700">
            {{ farmError }}
          </p>
        </div>

        <!-- Join -->
        <div class="space-y-3">
          <h3 class="font-stardew-bold text-blue-950">Join Farm</h3>

          <input
            v-model="joinCode"
            placeholder="Enter farm code"
            class="border-menu bg-blue-50 rounded px-3 py-2 w-full"
          />

          <button
            class="border-menu grad-blue py-2 px-4 font-stardew-thin text-blue-950 stardew-btn"
            @click="joinFarm"
          >
            Join
          </button>
        </div>
      </div>
    </div>

    <!-- DELETE MODAL -->
    <div
      v-if="farmPendingDelete"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="border-menu grad-amber rounded-lg p-6 w-full max-w-sm space-y-4">
        <h3 class="font-stardew-bold text-orange-950 text-lg">Delete Farm?</h3>

        <p class="text-sm text-orange-900">
          This will permanently delete the farm and all associated data.
        </p>

        <div class="flex justify-end gap-2">
          <button
            class="border-menu grad-amber py-2 px-4 font-stardew-thin text-orange-950 stardew-btn"
            @click="farmPendingDelete = null"
          >
            Cancel
          </button>

          <button
            class="border-menu grad-red py-2 px-4 font-stardew-thin text-red-950 stardew-btn"
            @click="confirmDelete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { getMyFarms, getFarmByCode, type Farm } from '@/lib/farms'
import { useBundlesStore } from '@/stores/bundles'

const router = useRouter()
const store = useBundlesStore()

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
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, avatar')
      .eq('id', data.user.id)
      .single()

    displayName.value = profile?.display_name ?? ''
    avatar.value = profile?.avatar ?? null
  }

  farms.value = await getMyFarms()
  const lastFarmId = localStorage.getItem('lastFarmId')

  if (lastFarmId) {
    const farm = farms.value.find((f) => f.id === lastFarmId)

    if (farm) {
      await store.connectToFarm(farm)
      router.push(`/farm/${farm.code}`)
      return
    }
  }
})

async function logout() {
  await store.disconnectFromFarm()
  await supabase.auth.signOut()
  router.push('/login')
}

async function saveProfile() {
  const { data } = await supabase.auth.getUser()
  if (!data.user) return

  const trimmed = displayName.value.trim()
  if (!trimmed) return

  const { error } = await supabase
    .from('profiles')
    .update({
      display_name: trimmed,
      avatar: avatar.value,
    })
    .eq('id', data.user.id)

  console.log('Profile update error:', error)

  isEditing.value = false
}

function cancelEdit() {
  isEditing.value = false
}

async function createFarm() {
  farmError.value = null

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
    return
  }

  await supabase.from('farm_members').insert({
    farm_id: farm.id,
    user_id: data.user.id,
    role: 'admin',
  })

  farms.value = await getMyFarms()
  newFarmName.value = ''
}
async function connectToFarm(farm: Farm) {
  await store.connectToFarm(farm)
  router.push(`/farm/${farm.code}`)
}

async function joinFarm() {
  const farm = await getFarmByCode(joinCode.value.trim().toUpperCase())
  if (!farm) return

  const { data } = await supabase.auth.getUser()
  if (!data.user) return

  await supabase.from('farm_members').insert({
    farm_id: farm.id,
    user_id: data.user.id,
    role: 'member',
  })

  farms.value = await getMyFarms()
  joinCode.value = ''
}

async function leaveFarm(farmId: string) {
  if (!currentUserId.value) {
    console.log('No current user')
    return
  }

  const { error } = await supabase.from('farm_members').delete().match({
    farm_id: farmId,
    user_id: currentUserId.value,
  })

  console.log('Leave error:', error)

  if (store.currentFarmId === farmId) {
    await store.disconnectFromFarm()
    router.push('/account')
  }

  farms.value = await getMyFarms()
}

async function deleteFarm(farmId: string) {
  if (!currentUserId.value) return

  const farm = farms.value.find((f) => f.id === farmId)
  if (!farm) return

  if (farm.created_by !== currentUserId.value) return

  if (store.currentFarmId === farmId) {
    await store.disconnectFromFarm()
  }

  await supabase.from('farm_members').delete().match({
    farm_id: farmId,
    user_id: currentUserId.value,
  })

  await supabase.from('farm_sessions').delete().eq('farm_id', farmId)

  await supabase.from('farms').delete().eq('id', farmId)

  farms.value = await getMyFarms()
}
async function confirmDelete() {
  if (!farmPendingDelete.value) return

  await deleteFarm(farmPendingDelete.value)
  farmPendingDelete.value = null
}
</script>
