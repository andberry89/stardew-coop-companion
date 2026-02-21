<template>
  <div class="max-w-7xl mx-auto p-4 relative flex flex-col gap-6">
    <AuthLogin />

    <AppHeader />

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
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { FilterState, ViewStatus } from '@/types'
import { supabase } from '@/lib/supabase'

if (import.meta.env.DEV) {
  // @ts-ignore
  window.supabase = supabase
}

import AuthLogin from './components/AuthLogin.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import ViewToggle from '@/components/layout/ViewToggle.vue'
import FilterPanel from '@/components/layout/FilterPanel.vue'
import BundlesView from '@/components/bundle/BundlesView.vue'
import SeasonView from '@/components/season/SeasonView.vue'
import RoomsView from '@/components/room/RoomsView.vue'

const view = ref<ViewStatus>('bundle')
const filters = ref<FilterState>({
  bundleSeason: null,
  seasonViewSeason: null,
  type: null,
  roomStatus: null,
})

supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event: ', event)
})

onMounted(async () => {
  await supabase.auth.getSession()
})
</script>
