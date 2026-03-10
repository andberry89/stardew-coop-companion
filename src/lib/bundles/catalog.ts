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

export function buildCatalogState(payload: CatalogPayload): CatalogState {
  const roomsById = {} as Record<RoomId, Room>
  const itemsById: Record<string, Item> = {}
  const bundlesById: Record<string, Bundle> = {}
  const entriesByKey: Record<string, BundleEntry> = {}
  const bundleIdsByRoomId = {} as Record<RoomId, string[]>
  const entryKeysByBundleId: Record<string, string[]> = {}
  const bundleIdsByItemId: Record<string, string[]> = {}
  const itemIdsBySeason = {} as Record<Season, string[]>
  const entryKeysByItemId: Record<string, string[]> = {}

  for (const room of payload.rooms) {
    roomsById[room.id] = room
    bundleIdsByRoomId[room.id] = []
  }

  for (const item of payload.items) {
    itemsById[item.id] = item

    for (const season of item.seasons) {
      itemIdsBySeason[season] ??= []
      itemIdsBySeason[season].push(item.id)
    }
  }

  for (const bundle of payload.bundles) {
    bundlesById[bundle.id] = bundle
    entryKeysByBundleId[bundle.id] ??= []
    ;(bundleIdsByRoomId[bundle.room] ??= []).push(bundle.id)
  }

  for (const entry of payload.entries) {
    const key = `${entry.bundleId}:${entry.id}`
    entriesByKey[key] = entry
    ;(entryKeysByBundleId[entry.bundleId] ??= []).push(key)

    bundleIdsByItemId[entry.itemId] ??= []
    const itemBundleIds = bundleIdsByItemId[entry.itemId]
    if (itemBundleIds && !itemBundleIds.includes(entry.bundleId)) {
      itemBundleIds.push(entry.bundleId)
    }

    entryKeysByItemId[entry.itemId] ??= []
    const itemEntryKeys = entryKeysByItemId[entry.itemId]
    if (itemEntryKeys) {
      itemEntryKeys.push(key)
    }
  }

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
