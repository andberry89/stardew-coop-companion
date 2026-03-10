import type { Bundle, BundleEntry, BundleProgress, Item, RoomId, RoomProgress } from '@/types'

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
