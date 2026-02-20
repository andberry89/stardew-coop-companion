<template>
  <div class="max-w-7xl mx-auto p-4 relative flex flex-col gap-6">
    <AppHeader />

    <ViewToggle v-model="view" />

    <main class="flex gap-2">
      <FilterPanel
        :view="view"
        :bundle-season="bundleSeason"
        :season-view-season="seasonViewSeason"
        :selected-type="selectedType"
        @update:bundleSeason="bundleSeason = $event"
        @update:seasonViewSeason="seasonViewSeason = $event"
        @update:selectedType="selectedType = $event"
      />

      <section class="flex-1">
        <BundlesView v-if="view === 'bundle'" :selectedSeason="bundleSeason" />
        <SeasonView v-else :season="seasonViewSeason" :selectedType="selectedType" />
      </section>
    </main>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import type { Season } from '@/types'

import AppHeader from '@/components/layout/AppHeader.vue'
import ViewToggle from '@/components/layout/ViewToggle.vue'
import FilterPanel from '@/components/layout/FilterPanel.vue'
import BundlesView from '@/components/bundle/BundlesView.vue'
import SeasonView from '@/components/season/SeasonView.vue'

const view = ref<'bundle' | 'season'>('bundle')
const bundleSeason = ref<Season>(null)
const seasonViewSeason = ref<Season>('spring')
const selectedType = ref<ItemType | null>(null)
</script>
