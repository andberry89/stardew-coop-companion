<template>
  <header class="relative flex items-center justify-center py-4">
    <HeaderMenu
      :currentAvatar="currentAvatar"
      :exportLoading="exportLoading"
      :importLoading="importLoading"
      :logoutLoading="logoutLoading"
      @account="handleLeaveFarm"
      @help="openHelp"
      @export="openExport"
      @import="openImport"
      @logout="logout"
    />

    <HeaderLogo />

    <HeaderFarmStatus
      :players="players"
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
import HeaderMenu from '@/components/header/HeaderMenu.vue'
import HeaderLogo from '@/components/header/HeaderLogo.vue'
import HeaderFarmStatus from '@/components/header/HeaderFarmStatus.vue'
import ExportModal from '@/components/header/ExportModal.vue'
import ImportModal from '@/components/header/ImportModal.vue'
import { useAppHeader } from '@/composables/useAppHeader'

const {
  store,
  players,
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
  openHelp,
  openImport,
  runImport,
  copyExport,
} = useAppHeader()
</script>
