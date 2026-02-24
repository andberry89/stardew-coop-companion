<template>
  <div class="max-w-4xl mx-auto p-6 space-y-8 border-menu grad-background">
    <!-- Profile -->
    <section class="space-y-2">
      <h1 class="text-2xl font-bold font-stardew-thin">Account</h1>

      <div class="text-sm text-gray-400">
        {{ email }}
      </div>

      <!-- View Mode -->
      <div v-if="!isEditing" class="flex items-center gap-4">
        <img
          v-if="avatar"
          :src="`/images/avatars/${avatar}-portrait.png`"
          class="w-20 h-20 rounded object-cover"
        />

        <div>
          <div class="text-lg font-semibold">
            {{ displayName || 'No display name' }}
          </div>

          <button
            class="mt-2 px-3 py-1 bg-gray-700 text-white rounded text-sm hover:cursor-pointer"
            @click="isEditing = true"
          >
            Edit Profile
          </button>
        </div>
      </div>

      <!-- Edit Mode -->
      <div v-else class="space-y-4">
        <div>
          <label class="block text-sm mb-1">Display Name</label>
          <input v-model="displayName" class="border px-3 py-2 rounded w-full" layNam />
        </div>

        <div>
          <label class="block text-sm mb-2">Avatar</label>
          <div class="grid grid-cols-4 gap-2">
            <img
              v-for="name in avatarOptions"
              :key="name"
              :src="`/images/avatars/${name}-portrait.png`"
              class="size-20 rounded cursor-pointer border-2"
              :class="avatar === name ? 'border-green-500' : 'border-transparent'"
              @click="avatar = name"
            />
          </div>
        </div>

        <div class="flex gap-2">
          <button class="px-3 py-1 bg-green-600 text-white rounded text-sm" @click="saveProfile">
            Save
          </button>

          <button class="px-3 py-1 bg-gray-600 text-white rounded text-sm" @click="cancelEdit">
            Cancel
          </button>
        </div>
      </div>
    </section>

    <!-- Farms -->
    <section class="space-y-4">
      <h2 class="text-xl font-semibold">Your Farms</h2>

      <div
        v-for="farm in farms"
        :key="farm.id"
        class="flex items-center justify-between border p-3 rounded"
      >
        <div>
          <div class="font-medium">{{ farm.name }}</div>
          <div class="text-xs text-gray-400">{{ farm.code }}</div>
        </div>

        <button
          class="px-3 py-1 bg-blue-600 text-white rounded text-sm"
          @click="connectToFarm(farm)"
        >
          Connect
        </button>
        <div class="flex gap-2 mt-2">
          <button
            class="text-xs bg-gray-600 text-white px-2 py-1 rounded"
            @click="leaveFarm(farm.id)"
          >
            Leave
          </button>

          <button
            v-if="farm.created_by === currentUserId"
            class="text-xs bg-red-600 text-white px-2 py-1 rounded"
            @click="deleteFarm(farm.id)"
          >
            Delete
          </button>
        </div>
      </div>
    </section>

    <!-- Create Farm -->
    <section class="space-y-2">
      <h2 class="text-xl font-semibold">Create Farm</h2>

      <input
        v-model="newFarmName"
        placeholder="Farm name"
        class="border px-3 py-2 rounded w-full"
      />

      <button class="px-3 py-1 bg-purple-600 text-white rounded text-sm" @click="createFarm">
        Create
      </button>
      <p v-if="farmError" class="text-sm text-red-500">
        {{ farmError }}
      </p>
    </section>

    <!-- Join Farm -->
    <section class="space-y-2">
      <h2 class="text-xl font-semibold">Join Farm</h2>

      <input
        v-model="joinCode"
        placeholder="Enter farm code"
        class="border px-3 py-2 rounded w-full"
      />

      <button class="px-3 py-1 bg-indigo-600 text-white rounded text-sm" @click="joinFarm">
        Join
      </button>
    </section>
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
</script>
