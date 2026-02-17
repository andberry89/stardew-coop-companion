<template>
  <div class="max-w-7xl mx-auto p-4 relative flex flex-col gap-6">
    <AppHeader />
    <ViewToggle v-model="view" />
    <main class="flex gap-2">
      <FilterPanel :selected="selectedSeason" @seasonChange="selectedSeason = $event" />
      <section class="flex-1">
        <BundlesView v-if="view === 'bundle'" />
      </section>
    </main>
  </div>
  <div class="opacity-0">
    {{ seasonItems }}
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBundlesStore } from '@/stores/bundles'
import type { Season } from '@/types/bundles'

import AppHeader from '@/components/layout/AppHeader.vue'
import ViewToggle from '@/components/layout/ViewToggle.vue'
import FilterPanel from '@/components/layout/FilterPanel.vue'
import BundlesView from '@/components/bundle/BundlesView.vue'

const store = useBundlesStore()

const view = ref<'bundle' | 'season'>('bundle')
const selectedSeason = ref<Season>('all')

const seasonItems = computed(() => store.seasonView(selectedSeason.value))
</script>
