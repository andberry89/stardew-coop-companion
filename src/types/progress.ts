import type { Item } from '@/types'

// Unique key for a bundle entry in the format: bundleId:entryId.
export type EntryKey = `${string}:${string}`

// Player progress tracked for the current farm.
export type Progress = {
  entryCompletedById: Record<EntryKey, boolean>
  inventoryByItemId: Record<Item['id'], number>
}
