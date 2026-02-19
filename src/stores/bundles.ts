// src/stores/bundles.ts
import { defineStore } from 'pinia'
import type { Bundle, BundleEntry, Item, Season } from '@/types/bundles'
import type { Progress } from '@/types/progress'
import type { Room, RoomId } from '@/types/rooms'

type CatalogPayload = {
  rooms: Room[]
  items: Item[]
  bundles: Bundle[] // Bundle must include: room: RoomId
  entries: BundleEntry[]
}

type BundleItem = {
  entryKey: string
  entry: BundleEntry
  completed: boolean
  item?: Item
  options?: Item[]
}

export const useBundlesStore = defineStore('bundles', {
  state: () => ({
    // catalog
    roomsById: {} as Record<RoomId, Room>,
    itemsById: {} as Record<string, Item>,
    bundlesById: {} as Record<string, Bundle>,
    entriesByKey: {} as Record<string, BundleEntry>, // `${bundleId}:${entry.id}`

    // indexes
    bundleIdsByRoomId: {} as Record<RoomId, string[]>,
    entryKeysByBundleId: {} as Record<string, string[]>,
    bundleIdsByItemId: {} as Record<string, string[]>,

    // user progress
    progress: {
      entryCompletedById: {},
      inventoryByItemId: {},
    } as Progress,
  }),

  getters: {
    isEntryCompleted: (s) => {
      return (entryKey: string) => !!s.progress.entryCompletedById[entryKey]
    },

    completedItemsForBundle: (s) => {
      return (bundleId: string) => {
        const keys = s.entryKeysByBundleId[bundleId] ?? []
        return keys
          .filter((entryKey) => !!s.progress.entryCompletedById[entryKey])
          .map((entryKey) => {
            const entry = s.entriesByKey[entryKey]
            const itemId = entry.itemId ? entry.itemId : (entry.optionItemIds?.[0] ?? null)
            return itemId ? s.itemsById[itemId] : null
          })
          .filter((item) => item !== null)
      }
    },

    bundleProgress: (s) => {
      return (bundleId: string) => {
        const entryKeys = s.entryKeysByBundleId[bundleId] ?? []
        const completed = entryKeys.reduce(
          (acc, k) => acc + (s.progress.entryCompletedById[k] ? 1 : 0),
          0,
        )
        const required = s.bundlesById[bundleId]?.requiredCount ?? 0
        return { completed, required, isComplete: completed >= required }
      }
    },

    roomProgress: (s) => {
      return (roomId: RoomId) => {
        const bundleIds = s.bundleIdsByRoomId[roomId] ?? []
        const totalBundles = bundleIds.length

        const completedBundles = bundleIds.reduce((acc, bundleId) => {
          const entryKeys = s.entryKeysByBundleId[bundleId] ?? []
          const completedEntries = entryKeys.reduce(
            (a, k) => a + (s.progress.entryCompletedById[k] ? 1 : 0),
            0,
          )
          const required = s.bundlesById[bundleId]?.requiredCount ?? 0
          return acc + (completedEntries >= required ? 1 : 0)
        }, 0)

        return {
          completedBundles,
          totalBundles,
          isComplete: totalBundles > 0 && completedBundles === totalBundles,
        }
      }
    },

    // Bundles grouped by room (for room sorting UI)
    bundlesByRoomView(): Array<{
      room: Room
      progress: ReturnType<ReturnType<typeof useBundlesStore>['roomProgress']>
      bundles: Array<{
        bundle: Bundle
        progress: ReturnType<ReturnType<typeof useBundlesStore>['bundleProgress']>
        items: BundleItem[]
      }>
    }> {
      const rooms = Object.values(this.roomsById).sort((a, b) => a.sortOrder - b.sortOrder)

      return rooms.map((room) => {
        const bundleIds = this.bundleIdsByRoomId[room.id] ?? []
        const bundles = bundleIds
          .map((id) => this.bundlesById[id])
          .filter((b): b is Bundle => !!b)
          .sort((a, b) => {
            const ao = a.sortOrder ?? Number.POSITIVE_INFINITY
            const bo = b.sortOrder ?? Number.POSITIVE_INFINITY
            if (ao !== bo) return ao - bo
            return a.name.localeCompare(b.name)
          })

        return {
          room,
          progress: this.roomProgress(room.id),
          bundles: bundles.map((bundle) => {
            const keys = this.entryKeysByBundleId[bundle.id] ?? []
            const items: BundleItem[] = keys.map((entryKey) => {
              const entry = this.entriesByKey[entryKey]
              const completed = !!this.progress.entryCompletedById[entryKey]

              if (entry.itemId) {
                return {
                  entryKey,
                  entry,
                  completed,
                  item: this.itemsById[entry.itemId],
                }
              }

              const optionIds = entry.optionItemIds ?? []
              return {
                entryKey,
                entry,
                completed,
                options: optionIds.map((id) => this.itemsById[id]).filter(Boolean),
              }
            })

            return {
              bundle,
              progress: this.bundleProgress(bundle.id),
              items,
            }
          }),
        }
      })
    },

    // Flat bundle list (sort by name)
    bundlesView(): Array<{
      bundle: Bundle
      progress: ReturnType<ReturnType<typeof useBundlesStore>['bundleProgress']>
      items: BundleItem[]
    }> {
      return Object.values(this.bundlesById)
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((bundle) => {
          const keys = this.entryKeysByBundleId[bundle.id] ?? []
          const items: BundleItem[] = keys.map((entryKey) => {
            const entry = this.entriesByKey[entryKey]
            const completed = !!this.progress.entryCompletedById[entryKey]

            if (entry.itemId) {
              return {
                entryKey,
                entry,
                completed,
                item: this.itemsById[entry.itemId],
              }
            }

            const optionIds = entry.optionItemIds ?? []
            return {
              entryKey,
              entry,
              completed,
              options: optionIds.map((id) => this.itemsById[id]).filter(Boolean),
            }
          })

          return { bundle, progress: this.bundleProgress(bundle.id), items }
        })
    },

    // Season view (items + per-bundle usages)
    seasonView: (s) => {
      return (season: Season) => {
        const items = Object.values(s.itemsById).filter(
          (i) => i.seasons.includes(season) || i.seasons.includes('any'),
        )

        return items
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((item) => {
            const bundleIds = s.bundleIdsByItemId[item.id] ?? []

            const usages = bundleIds.flatMap((bundleId) => {
              const keys = s.entryKeysByBundleId[bundleId] ?? []
              return keys
                .filter((entryKey) => {
                  const entry = s.entriesByKey[entryKey]
                  return entry.itemId === item.id || (entry.optionItemIds ?? []).includes(item.id)
                })
                .map((entryKey) => {
                  const entry = s.entriesByKey[entryKey]
                  const bundle = s.bundlesById[bundleId]
                  return {
                    entryKey,
                    bundleId,
                    bundleName: bundle?.name ?? bundleId,
                    completed: !!s.progress.entryCompletedById[entryKey],
                    requiredPerSubmission: entry.requiredPerSubmission ?? 1,
                    minQuality: entry.minQuality,
                    isOption: !!entry.optionItemIds?.length && !entry.itemId,
                  }
                })
            })

            return {
              item,
              inventory: s.progress.inventoryByItemId[item.id] ?? 0,
              usages,
            }
          })
      }
    },

    // Season view (filtered by type)
    seasonItemsByType: (s) => {
      return (season: Season, type: string | null) => {
        const items = Object.values(s.itemsById).filter(
          (item) => item.seasons.includes(season) || item.seasons.includes('any'),
        )
        return items
          .filter((item) => (type ? item.type === type : true))
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((item) => {
            const bundleIds = s.bundleIdsByItemId[item.id] ?? []
            const usages = bundleIds.flatMap((bundleId) => {
              const keys = s.entryKeysByBundleId[bundleId] ?? []
              return keys
                .filter((entryKey) => {
                  const entry = s.entriesByKey[entryKey]
                  return entry.itemId === item.id || (entry.optionItemIds ?? []).includes(item.id)
                })
                .map((entryKey) => {
                  const entry = s.entriesByKey[entryKey]
                  const bundle = s.bundlesById[bundleId]
                  return {
                    entryKey,
                    bundleId,
                    bundleName: bundle?.name ?? bundleId,
                    completed: !!s.progress.entryCompletedById[entryKey],
                    requiredPerSubmission: entry.requiredBySubmission ?? 1,
                    minQuality: entry.minQuality,
                    isOption: !!entry.optionItemIds?.length && !entry?.itemId,
                  }
                })
            })

            return {
              item,
              inventory: s.progress.inventoryByItemId[item.id] ?? 0,
              usages,
            }
          })
      }
    },

    // Check if items are in selected season
    isItemInSeason: (s) => {
      return (itemId: string, season: string) => {
        const item = s.itemsById[itemId]
        if (!item) return true
        return season === 'all' || item.seasons.includes(season) || item.seasons.includes('any')
      }
    },
  },

  actions: {
    initializeCatalog(payload: CatalogPayload) {
      // reset
      this.roomsById = {} as Record<RoomId, Room>
      this.itemsById = {}
      this.bundlesById = {}
      this.entriesByKey = {}
      this.bundleIdsByRoomId = {} as Record<RoomId, string[]>
      this.entryKeysByBundleId = {}
      this.bundleIdsByItemId = {}

      // rooms
      for (const room of payload.rooms) {
        this.roomsById[room.id] = room
        this.bundleIdsByRoomId[room.id] = []
      }

      // items
      for (const item of payload.items) {
        this.itemsById[item.id] = item
      }

      // bundles
      for (const bundle of payload.bundles) {
        this.bundlesById[bundle.id] = bundle
        this.entryKeysByBundleId[bundle.id] ??= []
        ;(this.bundleIdsByRoomId[bundle.room] ??= []).push(bundle.id)
      }

      // entries + indexes
      for (const entry of payload.entries) {
        const key = `${entry.bundleId}:${entry.id}`
        this.entriesByKey[key] = entry
        ;(this.entryKeysByBundleId[entry.bundleId] ??= []).push(key)

        const ids = entry.itemId ? [entry.itemId] : (entry.optionItemIds ?? [])
        for (const itemId of ids) {
          this.bundleIdsByItemId[itemId] ??= []
          if (!this.bundleIdsByItemId[itemId].includes(entry.bundleId)) {
            this.bundleIdsByItemId[itemId].push(entry.bundleId)
          }
        }
      }

      // deterministic order
      for (const roomId in this.bundleIdsByRoomId) {
        this.bundleIdsByRoomId[roomId as RoomId].sort((a, b) => {
          const A = this.bundlesById[a]
          const B = this.bundlesById[b]
          const ao = A?.sortOrder ?? Number.POSITIVE_INFINITY
          const bo = B?.sortOrder ?? Number.POSITIVE_INFINITY
          if (ao !== bo) return ao - bo
          return (A?.name ?? a).localeCompare(B?.name ?? b)
        })
      }
      for (const bundleId in this.entryKeysByBundleId) {
        this.entryKeysByBundleId[bundleId].sort()
      }
      for (const itemId in this.bundleIdsByItemId) {
        this.bundleIdsByItemId[itemId].sort()
      }
    },

    toggleEntry(entryKey: string) {
      this.progress.entryCompletedById[entryKey] = !this.progress.entryCompletedById[entryKey]
    },

    setInventory(itemId: string, count: number) {
      const safe = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0
      this.progress.inventoryByItemId[itemId] = safe
    },

    resetProgress() {
      this.progress.entryCompletedById = {}
      this.progress.inventoryByItemId = {}
    },
  },
})
