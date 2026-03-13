import type {
  Bundle,
  BundleEntry,
  BundleItem,
  BundleProgress,
  BundleSection,
  Item,
  Room,
  RoomId,
  RoomProgress,
  RoomSection,
} from '@/types'

// ─────────────────────────────
// View Builder Inputs
// ─────────────────────────────

type BuildBundleItemsInput = {
  entryKeys: string[]
  entriesByKey: Record<string, BundleEntry>
  itemsById: Record<string, Item>
  entryCompletedById: Record<string, boolean>
}

type BuildBundlesViewInput = {
  bundlesById: Record<string, Bundle>
  entryKeysByBundleId: Record<string, string[]>
  entriesByKey: Record<string, BundleEntry>
  itemsById: Record<string, Item>
  entryCompletedById: Record<string, boolean>
  getBundleProgress: (bundleId: string) => BundleProgress
}

type BuildBundlesByRoomViewInput = BuildBundlesViewInput & {
  roomsById: Record<RoomId, Room>
  bundleIdsByRoomId: Record<RoomId, string[]>
  getRoomProgress: (roomId: RoomId) => RoomProgress
}

// ─────────────────────────────
// Shared Bundle Item Builder
// ─────────────────────────────

// Build the renderable item list for a bundle from its entry keys.
// Shared by both the flat Bundle view and the Room-grouped view.
function buildBundleItems({
  entryKeys,
  entriesByKey,
  itemsById,
  entryCompletedById,
}: BuildBundleItemsInput): BundleItem[] {
  return entryKeys
    .map((entryKey) => {
      const entry = entriesByKey[entryKey]
      if (!entry) {
        return null
      }

      const item = itemsById[entry.itemId]
      if (!item) {
        return null
      }

      return {
        entryKey,
        entry,
        completed: !!entryCompletedById[entryKey],
        item,
      }
    })
    .filter((item): item is BundleItem => item !== null)
}

// ─────────────────────────────
// Flat Bundle View
// ─────────────────────────────

// Build the flat Bundle view, sorted alphabetically by bundle name.
export function buildBundlesView({
  bundlesById,
  entryKeysByBundleId,
  entriesByKey,
  itemsById,
  entryCompletedById,
  getBundleProgress,
}: BuildBundlesViewInput): BundleSection[] {
  return Object.values(bundlesById)
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((bundle) => {
      const entryKeys = entryKeysByBundleId[bundle.id] ?? []
      const items = buildBundleItems({
        entryKeys,
        entriesByKey,
        itemsById,
        entryCompletedById,
      })

      return {
        bundle,
        progress: getBundleProgress(bundle.id),
        items,
      }
    })
}

// ─────────────────────────────
// Room View
// ─────────────────────────────

// Build the Room view by grouping bundles under their parent room
// and attaching progress data for both rooms and bundles.
export function buildBundlesByRoomView({
  roomsById,
  bundleIdsByRoomId,
  bundlesById,
  entryKeysByBundleId,
  entriesByKey,
  itemsById,
  entryCompletedById,
  getBundleProgress,
  getRoomProgress,
}: BuildBundlesByRoomViewInput): RoomSection[] {
  // Room sections follow the catalog sort order used by the tracker UI.
  const rooms = Object.values(roomsById).sort((a, b) => a.sortOrder - b.sortOrder)

  return rooms.map((room) => {
    const bundleIds = bundleIdsByRoomId[room.id] ?? []

    const bundles = bundleIds
      .map((bundleId) => bundlesById[bundleId])
      .filter((bundle): bundle is Bundle => !!bundle)
      .sort((a, b) => {
        // Keep bundle order stable within each room, preferring explicit
        // sortOrder and falling back to alphabetical order.
        const sortA = a.sortOrder ?? Number.POSITIVE_INFINITY
        const sortB = b.sortOrder ?? Number.POSITIVE_INFINITY

        if (sortA !== sortB) return sortA - sortB

        return a.name.localeCompare(b.name)
      })
      .map((bundle) => {
        const entryKeys = entryKeysByBundleId[bundle.id] ?? []
        const items = buildBundleItems({
          entryKeys,
          entriesByKey,
          itemsById,
          entryCompletedById,
        })

        return {
          bundle,
          progress: getBundleProgress(bundle.id),
          items,
        }
      })

    return {
      room,
      progress: getRoomProgress(room.id),
      bundles,
    }
  })
}
