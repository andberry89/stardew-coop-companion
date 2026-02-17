<template>
  <!-- <div class="space-y-2">
    <label
      v-for="item in props.items"
      :key="item.entryKey"
      class="flex items-center gap-2 p-2 border-menu rounded-lg"
    >
      <input type="checkbox" :checked="item.completed" @change="$emit('toggle', item.entryKey)" />
      <span>{{ item.item?.name ?? '(options)' }}</span>
      <span v-if="item.entry.requiredPerSubmission > 1">
        ×{{ item.entry.requiredPerSubmission }}
      </span>
    </label>
  </div> -->
  <div class="flex justify-center gap-1 flex-wrap">
    <div
      v-for="item in props.items"
      :key="item.entryKey"
      class="flex flex-col items-center text-center"
      :class="{ 'opacity-40 grayscale': !isAvailableInSeason(item) }"
    >
      <div class="bg-orange-300 border-item p-0 size-14 flex">
        <img :src="itemImg(item)" alt="Item" />
      </div>
      <p
        class="font-quicksand text-sm w-18 overflow-hidden overflow-ellipsis font-display whitespace-nowrap"
      >
        {{ item.item.name }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Item } from '@/types/bundles'

const props = defineProps({
  items: Array,
  selectedSeason: String,
})

function isAvailableInSeason(item) {
  const seasons = item.item?.seasons ?? []
  if (props.selectedSeason === 'all') return true
  return seasons.includes(props.selectedSeason || seasons.includes('any'))
}

function itemImg(item: Item) {
  return `/images/items/${item.entry.itemId}.png`
}
</script>
