import type { Bundle, BundleEntry, Item, Room, RoomId, Season } from '@/types'

export type CatalogPayload = {
  rooms: Room[]
  items: Item[]
  bundles: Bundle[]
  entries: BundleEntry[]
}

export type CatalogState = {
  roomsById: Record<RoomId, Room>
  itemsById: Record<string, Item>
  bundlesById: Record<string, Bundle>
  entriesByKey: Record<string, BundleEntry>
  bundleIdsByRoomId: Record<RoomId, string[]>
  entryKeysByBundleId: Record<string, string[]>
  bundleIdsByItemId: Record<string, string[]>
  itemIdsBySeason: Record<Season, string[]>
  entryKeysByItemId: Record<string, string[]>
}

// Normalize the raw Community Center catalog into lookup maps the app can
// use for fast access by id, room, bundle, item, and season.

export function buildCatalogState(payload: CatalogPayload): CatalogState {
  // ─────────────────────────────
  // Initialize Lookup Maps
  // ─────────────────────────────

  const roomsById = {} as Record<RoomId, Room>
  const itemsById: Record<string, Item> = {}
  const bundlesById: Record<string, Bundle> = {}
  const entriesByKey: Record<string, BundleEntry> = {}
  const bundleIdsByRoomId = {} as Record<RoomId, string[]>
  const entryKeysByBundleId: Record<string, string[]> = {}
  const bundleIdsByItemId: Record<string, string[]> = {}
  const itemIdsBySeason = {} as Record<Season, string[]>
  const entryKeysByItemId: Record<string, string[]> = {}

  // ─────────────────────────────
  // Index Rooms
  // ─────────────────────────────

  // Index rooms and initialize the room -> bundle relationship map.
  for (const room of payload.rooms) {
    roomsById[room.id] = room
    bundleIdsByRoomId[room.id] = []
  }

  // ─────────────────────────────
  // Index Items
  // ─────────────────────────────

  // Index items and group them by season for Seasonal view lookups.
  for (const item of payload.items) {
    itemsById[item.id] = item

    for (const season of item.seasons) {
      itemIdsBySeason[season] ??= []
      itemIdsBySeason[season].push(item.id)
    }
  }

  // ─────────────────────────────
  // Index Bundles
  // ─────────────────────────────

  // Index bundles and attach each bundle to its parent room.
  for (const bundle of payload.bundles) {
    bundlesById[bundle.id] = bundle
    entryKeysByBundleId[bundle.id] ??= []
    ;(bundleIdsByRoomId[bundle.room] ??= []).push(bundle.id)
  }

  // ─────────────────────────────
  // Index Entries
  // ─────────────────────────────

  // Index bundle entries and build reverse lookups by bundle and item.
  for (const entry of payload.entries) {
    // Entry ids are only unique within a bundle, so use a composite key
    // to create a stable app-wide lookup id for each entry.
    const key = `${entry.bundleId}:${entry.id}`
    entriesByKey[key] = entry
    ;(entryKeysByBundleId[entry.bundleId] ??= []).push(key)

    const itemBundleIds = (bundleIdsByItemId[entry.itemId] ??= [])

    if (!itemBundleIds.includes(entry.bundleId)) {
      itemBundleIds.push(entry.bundleId)
    }

    const itemEntryKeys = (entryKeysByItemId[entry.itemId] ??= [])
    itemEntryKeys.push(key)
  }

  // ─────────────────────────────
  // Normalize / Sort Indexes
  // ─────────────────────────────

  // Sort indexed relationship arrays so bundle and entry order stays stable
  // across views and derived lookups.
  for (const roomId in bundleIdsByRoomId) {
    bundleIdsByRoomId[roomId as RoomId].sort((a, b) => {
      const bundleA = bundlesById[a]
      const bundleB = bundlesById[b]
      const sortA = bundleA?.sortOrder ?? Number.POSITIVE_INFINITY
      const sortB = bundleB?.sortOrder ?? Number.POSITIVE_INFINITY

      if (sortA !== sortB) return sortA - sortB

      return (bundleA?.name ?? a).localeCompare(bundleB?.name ?? b)
    })
  }

  for (const bundleId in entryKeysByBundleId) {
    const bundleEntryKeys = entryKeysByBundleId[bundleId]
    if (bundleEntryKeys) {
      bundleEntryKeys.sort()
    }
  }

  for (const itemId in bundleIdsByItemId) {
    const itemBundleIds = bundleIdsByItemId[itemId]
    if (itemBundleIds) {
      itemBundleIds.sort()
    }
  }

  return {
    roomsById,
    itemsById,
    bundlesById,
    entriesByKey,
    bundleIdsByRoomId,
    entryKeysByBundleId,
    bundleIdsByItemId,
    itemIdsBySeason,
    entryKeysByItemId,
  }
}
