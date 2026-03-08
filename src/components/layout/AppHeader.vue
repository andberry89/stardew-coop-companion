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
import HeaderMenu from '@/components/layout/HeaderMenu.vue'
import HeaderLogo from '@/components/layout/HeaderLogo.vue'
import HeaderFarmStatus from '@/components/layout/HeaderFarmStatus.vue'
import ExportModal from '@/components/layout/ExportModal.vue'
import ImportModal from '@/components/layout/ImportModal.vue'
import { useAppHeader } from '@/composables/useAppHeader'

const {
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
} = useAppHeader()
</script>
