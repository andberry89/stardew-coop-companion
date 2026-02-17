<template>
  <div class="flex justify-center gap-1 flex-wrap">
    <div
      v-for="item in props.items"
      :key="item.entryKey"
      class="flex flex-col items-center text-center"
      :class="{
        'opacity-40 grayscale pointer-events-none': !isAvailableInSeason(item),
        'opacity-80': isCompleted(item),
      }"
      @click="toggleItem(item)"
    >
      <div class="relative bg-orange-300 border-item p-0 size-14 flex justify-center items-center">
        <img :src="itemImg(item)" alt="Item" />
        <img
          v-if="isCompleted(item)"
          src="/images/icons/golden-scroll.png"
          class="absolute inset-0 m-auto size-10"
          alt="Completed"
        />
      </div>
      <p
        class="font-quicksand text-sm w-18 overflow-hidden overflow-ellipsis font-display whitespace-nowrap"
      >
        {{ item.item?.name }}
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

const emit = defineEmits(['toggle'])

function isAvailableInSeason(item: Item) {
  const seasons = item.item?.seasons ?? []
  if (props.selectedSeason === 'all') return true
  return seasons.includes(props.selectedSeason || seasons.includes('any'))
}

function isCompleted(item: Item) {
  return !!item.completed
}

function itemImg(item: Item) {
  return `/images/items/${item.entry.itemId}.png`
}

function toggleItem(item: Item) {
  if (!isAvailableInSeason(item)) return
  emit('toggle', item.entryKey)
}
</script>
