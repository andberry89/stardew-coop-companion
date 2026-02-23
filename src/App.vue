<template>
  <p>FarmId: {{ store.currentFarmId }}</p>
  <p>Status: {{ store.farmStatus }}</p>
  <div class="max-w-7xl mx-auto p-4 relative flex flex-col gap-6">
    <!-- Logged Out -->
    <AuthLogin v-if="!user" />

    <!-- Logged in, but no farm -->
    <FarmSelector v-else-if="user && !store.currentFarmId" />

    <!-- Connected -->
    <template v-else>
      <AppHeader :current-user-id="user?.id ?? null" />

      <ViewToggle v-model="view" />

      <main class="flex gap-2">
        <FilterPanel
          :view="view"
          :filters="filters"
          @update:bundleSeason="filters.bundleSeason = $event"
          @update:seasonViewSeason="filters.seasonViewSeason = $event"
          @update:type="filters.type = $event"
          @update:roomStatus="filters.roomStatus = $event"
        />

        <section class="flex-1">
          <BundlesView v-if="view === 'bundle'" :selectedSeason="filters.bundleSeason" />

          <SeasonView v-else-if="view === 'season'" :filters="filters" />

          <RoomsView v-else :filters="filters" />
        </section>
      </main>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { FilterState, ViewStatus } from '@/types'
import { supabase } from '@/lib/supabase'
import { useBundlesStore } from '@/stores/bundles'

import AuthLogin from './components/AuthLogin.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import ViewToggle from '@/components/layout/ViewToggle.vue'
import FilterPanel from '@/components/layout/FilterPanel.vue'
import BundlesView from '@/components/bundle/BundlesView.vue'
import SeasonView from '@/components/season/SeasonView.vue'
import RoomsView from '@/components/room/RoomsView.vue'
import FarmSelector from '@/components/FarmSelector.vue'

const view = ref<ViewStatus>('bundle')
const filters = ref<FilterState>({
  bundleSeason: null,
  seasonViewSeason: null,
  type: null,
  roomStatus: null,
})
const user = ref<null | { id: string }>(null)

const store = useBundlesStore()

supabase.auth.onAuthStateChange((_, session) => {
  user.value = session?.user ?? null
})

onMounted(async () => {
  const { data } = await supabase.auth.getSession()
  user.value = data.session?.user ?? null
})
</script>
