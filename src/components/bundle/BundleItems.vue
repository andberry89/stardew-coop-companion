<template>
  <div class="flex justify-center gap-1 flex-wrap">
    <div
      v-for="item in items"
      :key="item.entryKey"
      class="relative flex flex-col items-center text-center group"
      :class="{
        'opacity-40 grayscale pointer-events-none':
          !available(item) || (bundleFull && !completed(item)),
        'opacity-80': completed(item),
        'cursor-pointer': available(item) && (!bundleFull || completed(item)),
      }"
      @click="toggleItem(item)"
    >
      <ItemIcon
        :src="itemImg(item)"
        :min-quality="item.entry.minQuality"
        :required-per-submission="item.entry.requiredPerSubmission"
        :completed="completed(item)"
      />

      <BundleItemTooltip
        v-if="!completed(item) && item.item?.sources?.length"
        :sources="item.item.sources"
      />

      <p
        class="font-quicksand text-sm w-18 overflow-hidden overflow-ellipsis font-display whitespace-nowrap"
      >
        {{ item.item?.name }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BundleItem, Season } from '@/types'
import { isItemAvailableInSeason } from '@/utils/season'
import ItemIcon from '@/components/shared/ItemIcon.vue'
import BundleItemTooltip from './BundleItemTooltip.vue'

const { bundleFull, items, selectedSeason } = defineProps<{
  bundleFull: boolean
  items: BundleItem[]
  selectedSeason: Season | 'all'
}>()

const emit = defineEmits<{
  (e: 'toggle', entryKey: string): void
}>()

function available(item: BundleItem) {
  return isItemAvailableInSeason(item.item?.seasons, selectedSeason)
}

function completed(item: BundleItem) {
  return !!item.completed
}

function itemImg(item: BundleItem) {
  return `/images/items/${item.entry.itemId}.png`
}

function toggleItem(item: BundleItem) {
  if (!available(item)) return

  if (completed(item)) {
    emit('toggle', item.entryKey)
    return
  }

  if (bundleFull) return

  emit('toggle', item.entryKey)
}
</script>
