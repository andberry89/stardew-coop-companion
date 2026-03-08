<template>
  <div class="max-w-6xl mx-auto p-6 space-y-8">
    <LoadingOverlay v-if="connectingFarmId" title="Connecting..." message="Preparing your farm." />
    <AccountProfilePanel
      :email="email"
      :displayName="displayName"
      :isEditing="isEditing"
      :avatar="avatar"
      :avatarOptions="avatarOptions"
      :logoutLoading="logoutLoading"
      :saveProfileLoading="saveProfileLoading"
      @startEdit="isEditing = true"
      @logout="logout"
      @save="saveProfile"
      @cancel="cancelEdit"
      @update:displayName="displayName = $event"
      @update:avatar="avatar = $event"
    />

    <AccountFarmsPanel
      :farms="farms"
      :isEditing="isEditing"
      :currentUserId="currentUserId"
      :leavingFarmId="leavingFarmId"
      :deleteFarmLoading="deleteFarmLoading"
      :connecting="!!connectingFarmId"
      @connect="connectToFarm"
      @leave="leaveFarm"
      @delete="farmPendingDelete = $event"
    />

    <AccountManageFarmsPanel
      :newFarmName="newFarmName"
      :joinCode="joinCode"
      :createFarmLoading="createFarmLoading"
      :joinFarmLoading="joinFarmLoading"
      @create="createFarm"
      @join="joinFarm"
      @update:newFarmName="newFarmName = $event"
      @update:joinCode="joinCode = $event"
    />

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
import AccountProfilePanel from '@/components/account/AccountProfilePanel.vue'
import AccountFarmsPanel from '@/components/account/AccountFarmsPanel.vue'
import AccountManageFarmsPanel from '@/components/account/AccountManageFarmsPanel.vue'
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
