import type { BundleEntry, Item } from '@/types'

export type EntryKey = `${string}:${string}`
// bundleId:entryId format

export type Progress = {
  entryCompletedById: Record<EntryKey, boolean>
  inventoryByItemId: Record<Item['id'], number>
}
