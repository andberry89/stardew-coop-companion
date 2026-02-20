<template>
  <div class="max-w-7xl mx-auto p-4 relative flex flex-col gap-6">
    <AppHeader />

    <ViewToggle v-model="view" />

    <main class="flex gap-2">
      <FilterPanel
        :view="view"
        :filters="filters"
        @update:bundleSeason="filters.bundleSeason = $event"
        @update:seasonViewSeason="filters.seasonViewSeason = $event"
        @update:type="filters.type = $event"
      />

      <section class="flex-1">
        <BundlesView v-if="view === 'bundle'" :selectedSeason="filters.bundleSeason" />

        <SeasonView v-else :filters="filters" />
      </section>
    </main>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { FilterState } from '@/types'

import AppHeader from '@/components/layout/AppHeader.vue'
import ViewToggle from '@/components/layout/ViewToggle.vue'
import FilterPanel from '@/components/layout/FilterPanel.vue'
import BundlesView from '@/components/bundle/BundlesView.vue'
import SeasonView from '@/components/season/SeasonView.vue'

const view = ref<'bundle' | 'season'>('bundle')
const filters = ref<FilterState>({
  bundleSeason: null,
  seasonViewSeason: null,
  type: null,
})
</script>
