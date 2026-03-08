<template>
  <div class="max-w-6xl mx-auto p-6 space-y-8">
    <LoadingOverlay v-if="connectingFarmId" title="Connecting..." message="Preparing your farm." />
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
            :disabled="logoutLoading"
            class="border-menu grad-red py-2 px-4 font-stardew-thin text-red-950 stardew-btn disabled:opacity-50"
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
            :disabled="saveProfileLoading || !displayName.trim()"
            class="border-menu grad-green py-2 px-4 font-stardew-thin text-green-950 stardew-btn disabled:opacity-50"
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
            :disabled="!!connectingFarmId"
            class="border-menu grad-green py-2 px-4 font-stardew-thin text-green-950 stardew-btn"
            @click="connectToFarm(farm)"
          >
            Connect
          </button>

          <div v-if="isEditing" class="flex gap-2 pt-2">
            <button
              :disabled="leavingFarmId === farm.id"
              class="border-menu grad-amber py-2 px-3 font-stardew-thin text-orange-950 stardew-btn text-xs disabled:opacity-50"
              @click="leaveFarm(farm.id)"
            >
              Leave
            </button>

            <button
              v-if="farm.created_by === currentUserId"
              :disabled="deleteFarmLoading"
              class="border-menu grad-red py-2 px-3 font-stardew-thin text-red-950 stardew-btn text-xs disabled:opacity-50"
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
            :disabled="createFarmLoading"
            class="border-menu grad-blue py-2 px-4 font-stardew-thin text-blue-950 stardew-btn disabled:opacity-50"
            @click="createFarm"
          >
            Create
          </button>
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
            :disabled="joinFarmLoading || !joinCode.trim()"
            class="border-menu grad-blue py-2 px-4 font-stardew-thin text-blue-950 stardew-btn disabled:opacity-50"
            @click="joinFarm"
          >
            Join
          </button>
        </div>
      </div>
    </div>

    <DeleteFarmModal
      v-if="farmPendingDelete"
      :loading="deleteFarmLoading"
      @close="farmPendingDelete = null"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup lang="ts">
import LoadingOverlay from '@/components/ui/LoadingOverlay.vue'
import DeleteFarmModal from '@/components/account/DeleteFarmModal.vue'
import { useAccountPage } from '@/composables/useAccountPage'

const {
  email,
  displayName,
  farms,
  isEditing,
  avatar,
  newFarmName,
  joinCode,
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
} = useAccountPage()
</script>
