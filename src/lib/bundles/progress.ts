// Helper functions for computing Community Center progress in the tracker.
// These utilities derive bundle and room completion from the current
// entry completion state stored in the app.

import type { Bundle, BundleEntry, BundleProgress, Item, RoomId, RoomProgress } from '@/types'

// Return the item records for bundle entries that are currently marked complete.
// Used by the UI to display which bundle items have already been contributed.
export function getCompletedItemsForBundle(
  entryKeys: string[],
  entryCompletedById: Record<string, boolean>,
  entriesByKey: Record<string, BundleEntry>,
  itemsById: Record<string, Item>,
): Item[] {
  return entryKeys
    .filter((entryKey) => !!entryCompletedById[entryKey])
    .map((entryKey) => {
      const entry = entriesByKey[entryKey]
      return entry ? (itemsById[entry.itemId] ?? null) : null
    })
    .filter((item): item is Item => item !== null)
}

// Calculate bundle progress based on how many entries are completed
// compared to the bundle's required item count.
export function getBundleProgress(
  entryKeys: string[],
  entryCompletedById: Record<string, boolean>,
  requiredCount: number,
): BundleProgress {
  const completed = entryKeys.reduce((acc, entryKey) => {
    return acc + (entryCompletedById[entryKey] ? 1 : 0)
  }, 0)

  return {
    completed,
    required: requiredCount,
    isComplete: completed >= requiredCount,
  }
}

// Determine room completion by checking which bundles in the room
// have met their required entry count.
export function getRoomProgress(
  roomId: RoomId,
  bundleIdsByRoomId: Record<RoomId, string[]>,
  entryKeysByBundleId: Record<string, string[]>,
  entryCompletedById: Record<string, boolean>,
  bundlesById: Record<string, Bundle>,
): RoomProgress {
  const bundleIds = bundleIdsByRoomId[roomId] ?? []
  const totalBundles = bundleIds.length

  const completedBundles = bundleIds.reduce((acc, bundleId) => {
    const entryKeys = entryKeysByBundleId[bundleId] ?? []
    const requiredCount = bundlesById[bundleId]?.requiredCount ?? 0
    const progress = getBundleProgress(entryKeys, entryCompletedById, requiredCount)

    return acc + (progress.isComplete ? 1 : 0)
  }, 0)

  return {
    completedBundles,
    totalBundles,
    isComplete: totalBundles > 0 && completedBundles === totalBundles,
  }
}
