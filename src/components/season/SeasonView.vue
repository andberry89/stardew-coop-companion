<template>
  <section class="space-y-6">
    <SeasonSection
      v-for="seasonKey in seasonGroups"
      :key="seasonKey"
      :seasonKey="seasonKey"
      :typeGroups="groupedBySeasonAndType[seasonKey] ?? {}"
      :typeOrder="TYPE_ORDER"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SeasonSection from './SeasonSection.vue'
import { useSeasonView } from '@/composables/useSeasonView'
import type { FilterState } from '@/types/filters'

const props = defineProps<{
  filters: FilterState
}>()

const season = computed(() => props.filters.seasonViewSeason)
const type = computed(() => props.filters.type)

const { TYPE_ORDER, seasonGroups, groupedBySeasonAndType } = useSeasonView(season, type)
</script>
