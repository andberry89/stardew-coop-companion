<template>
  <div class="space-y-4">
    <SeasonFilter :selected="season" @update:selected="$emit('seasonChange', $event)" />

    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <SeasonItemCard v-for="row in items" :key="row.item.id" :row="row" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useBundlesStore } from '@/stores/bundles'
import SeasonFilter from './SeasonFilter.vue'
import SeasonItemCard from './SeasonItemCard.vue'

const props = defineProps({
  season: String,
})

const store = useBundlesStore()

const items = computed(() => store.seasonView(props.season))
</script>
