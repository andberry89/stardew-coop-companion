<template>
  <div class="border-4 border-yellow-800 grad-amber rounded-lg p-6 space-y-6 shadow-md">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-stardew-bold text-orange-950">Farmer Profile</h1>

      <div class="flex gap-2">
        <button
          v-if="!isEditing"
          class="border-menu grad-amber py-2 px-4 font-stardew-thin text-orange-950 stardew-btn"
          @click="emit('startEdit')"
        >
          Edit
        </button>

        <button
          v-if="isEditing"
          :disabled="deleteAccountLoading"
          class="border-menu grad-red py-2 px-4 font-stardew-thin text-red-950 stardew-btn disabled:opacity-50"
          @click="emit('deleteAccount')"
        >
          Delete Account
        </button>

        <button
          :disabled="logoutLoading"
          class="border-menu grad-red py-2 px-4 font-stardew-thin text-red-950 stardew-btn disabled:opacity-50"
          @click="emit('logout')"
        >
          Logout
        </button>
      </div>
    </div>

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

        <div class="text-sm text-orange-900 mt-3">
          {{ email }}
        </div>
      </div>
    </div>

    <div v-else class="space-y-4">
      <div>
        <label class="block text-sm font-stardew-bold text-orange-950 mb-1"> Display Name </label>
        <input
          :value="displayName"
          class="border-menu bg-amber-50 rounded px-3 py-2 w-full"
          @input="handleDisplayNameInput"
        />
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
            @click="emit('update:avatar', name)"
          />
        </div>
      </div>

      <div class="flex gap-3">
        <button
          :disabled="saveProfileLoading || !displayName.trim()"
          class="border-menu grad-green py-2 px-4 font-stardew-thin text-green-950 stardew-btn disabled:opacity-50"
          @click="emit('save')"
        >
          Save
        </button>

        <button
          class="border-menu grad-amber py-2 px-4 font-stardew-thin text-orange-950 stardew-btn"
          @click="emit('cancel')"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  email: string | null
  displayName: string
  isEditing: boolean
  avatar: string | null
  avatarOptions: string[]
  logoutLoading: boolean
  saveProfileLoading: boolean
  deleteAccountLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'startEdit'): void
  (e: 'logout'): void
  (e: 'deleteAccount'): void
  (e: 'save'): void
  (e: 'cancel'): void
  (e: 'update:displayName', value: string): void
  (e: 'update:avatar', value: string): void
}>()

function handleDisplayNameInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:displayName', target.value)
}
</script>
