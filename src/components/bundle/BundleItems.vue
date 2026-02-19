<template>
  <div class="flex justify-center gap-1 flex-wrap">
    <div
      v-for="item in props.items"
      :key="item.entryKey"
      class="relative flex flex-col items-center text-center"
      :class="{
        'opacity-40 grayscale pointer-events-none':
          !isAvailableInSeason(item) || (props.bundleFull && !isCompleted(item)),
        'opacity-80': isCompleted(item),
        'cursor-pointer': isAvailableInSeason(item) && (!props.bundleFull || isCompleted(item)),
      }"
      @click="toggleItem(item)"
    >
      <div class="relative bg-orange-300 border-item p-0 size-14 flex justify-center items-center">
        <img :src="itemImg(item)" alt="Item" />
        <!-- Quality Badge -->
        <img
          v-if="item.entry.minQuality"
          :src="qualityIconFor(item.entry.minQuality)"
          alt="Quality"
          class="absolute bottom-0 left-0 size-8"
        />

        <!-- Quanity Badge -->
        <div
          v-if="item.entry.requiredPerSubmission > 1"
          class="absolute font-quicksand bottom-0 right-0 bg-[rgba(0,0,0,0.7)] text-white text-xs font-bold px-0.5 rounded"
        >
          x{{ item.entry.requiredPerSubmission }}
        </div>

        <!-- Completed Checkmark -->
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
  bundleFull: Boolean,
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

function qualityIconFor(minQuality) {
  switch (minQuality) {
    case 'silver':
      return '/images/icons/silver-quality-icon.png'
    case 'gold':
      return '/images/icons/gold-quality-icon.png'
    case 'iridium':
      return '/images/icons/iridium-quality-icon.png'
    default:
      return null
  }
}

function toggleItem(item: Item) {
  if (!isAvailableInSeason(item)) return

  // Allow toggle if completed
  const completed = isCompleted(item)
  if (completed) {
    emit('toggle', item.entryKey)
    return
  }

  // If bundle is full, block new selections
  if (props.bundleFull) return

  // Otherwise allow toggle
  emit('toggle', item.entryKey)
}
</script>
