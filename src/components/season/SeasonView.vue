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
import SeasonSection from './SeasonSection.vue'
import type { Season } from '@/types'
import { useSeasonView } from '@/composables/useSeasonView'

const props = defineProps<{
  season: Season | null
  selectedType: string
}>()

const { TYPE_ORDER, seasonGroups, groupedBySeasonAndType } = useSeasonView(
  props.season,
  props.selectedType,
)
</script>
