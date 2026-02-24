// src/stores/bundles.ts
import { defineStore } from 'pinia'
import { supabase } from '@/lib/supabase'

import type {
  Bundle,
  BundleEntry,
  BundleItem,
  Item,
  Season,
  SeasonItemEntry,
  Progress,
  Room,
  RoomId,
} from '@/types'

type CatalogPayload = {
  rooms: Room[]
  items: Item[]
  bundles: Bundle[] // Bundle must include: room: RoomId
  entries: BundleEntry[]
}
const STATE_SCHEMA_VERSION = 1

export const useBundlesStore = defineStore('bundles', {
  state: () => ({
    // ─────────────────────────────
    // Farm Connection State
    // ─────────────────────────────
    currentFarmId: null as string | null,
    selectedFarm: null as null | {
      id: string
      name: string
      code: string
    },

    farmSessionId: null as string | null,
    farmStatus: 'idle' as 'idle' | 'connecting' | 'connected' | 'reconnecting' | 'full' | 'error',

    heartbeatTimer: null as ReturnType<typeof setInterval> | null,
    unsubscribeRealtime: null as (() => void) | null,
    activeSessionUserIds: [] as string[],

    // ─────────────────────────────
    // Catalog Data (static)
    // ─────────────────────────────
    roomsById: {} as Record<RoomId, Room>,
    itemsById: {} as Record<string, Item>,
    bundlesById: {} as Record<string, Bundle>,
    entriesByKey: {} as Record<string, BundleEntry>,

    // ─────────────────────────────
    // Catalog Indexes (derived)
    // ─────────────────────────────
    bundleIdsByRoomId: {} as Record<RoomId, string[]>,
    entryKeysByBundleId: {} as Record<string, string[]>,
    bundleIdsByItemId: {} as Record<string, string[]>,
    itemIdsBySeason: {} as Record<Season, string[]>,
    entryKeysByItemId: {} as Record<string, string[]>,

    // ─────────────────────────────
    // View Cache
    // ─────────────────────────────
    seasonCache: {} as Record<Season, SeasonItemEntry[]>,
    seasonCacheVersion: 0,

    // ─────────────────────────────
    // User Progress (synced)
    // ─────────────────────────────
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
            return s.itemsById[entry.itemId] ?? null
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

              return {
                entryKey,
                entry,
                completed,
                item: this.itemsById[entry.itemId],
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

            return {
              entryKey,
              entry,
              completed,
              item: this.itemsById[entry.itemId],
            }
          })

          return { bundle, progress: this.bundleProgress(bundle.id), items }
        })
    },

    // Season view (items + per-bundle usages)
    seasonView: (s) => {
      return (season: Season): SeasonItemEntry[] => {
        if (s.seasonCache[season]) {
          return s.seasonCache[season]
        }

        const itemIds =
          season === 'any'
            ? (s.itemIdsBySeason['any'] ?? [])
            : [...(s.itemIdsBySeason[season] ?? []), ...(s.itemIdsBySeason['any'] ?? [])]

        const result = itemIds
          .map((itemId) => {
            const item = s.itemsById[itemId]
            if (!item) return null

            const entryKeys = s.entryKeysByItemId[itemId] ?? []

            const usages = entryKeys.map((entryKey) => {
              const entry = s.entriesByKey[entryKey]
              const bundle = s.bundlesById[entry.bundleId]

              return {
                entryKey,
                bundleId: entry.bundleId,
                bundleName: bundle?.name ?? entry.bundleId,
                completed: !!s.progress.entryCompletedById[entryKey],
                requiredPerSubmission: entry.requiredPerSubmission ?? 1,
                minQuality: entry.minQuality,
              }
            })

            return {
              item,
              inventory: s.progress.inventoryByItemId[itemId] ?? 0,
              usages,
            }
          })
          .filter((x): x is SeasonItemEntry => !!x)
          .sort((a, b) => a.item.name.localeCompare(b.item.name))

        s.seasonCache[season] = result
        return result
      }
    },

    // Check if items are in selected season
    isItemInSeason: (s) => {
      return (itemId: string, season: Season | null) => {
        const item = s.itemsById[itemId]
        if (!item) return true
        if (!season) return true
        return item.seasons.includes(season) || item.seasons.includes('any')
      }
    },
  },

  actions: {
    // ─────────────────────────────
    // Catalog Initialization
    // ─────────────────────────────
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

        for (const season of item.seasons) {
          this.itemIdsBySeason[season] ??= []
          this.itemIdsBySeason[season].push(item.id)
        }
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

        const ids = [entry.itemId]

        for (const itemId of ids) {
          this.bundleIdsByItemId[itemId] ??= []
          if (!this.bundleIdsByItemId[itemId].includes(entry.bundleId)) {
            this.bundleIdsByItemId[itemId].push(entry.bundleId)
          }

          this.entryKeysByItemId[itemId] ??= []
          this.entryKeysByItemId[itemId].push(key)
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

    // ─────────────────────────────
    // Farm Connection Lifecycle
    // ─────────────────────────────
    async connectToFarm(farm: { id: string; name: string; code: string }) {
      // Claim seat → load state → subscribe → start heartbeat
      this.stopHeartbeat()
      this.farmStatus = 'connecting'

      const { data, error } = await supabase.rpc('claim_seat', {
        input_farm_id: farm.id,
      })

      if (error) {
        if (error.code === 'P0001' && error.message === 'Farm is full') {
          this.farmStatus = 'full'
          return
        }

        console.error('Seat claim failed', error)
        this.farmStatus = 'error'
        return
      }

      this.farmSessionId = data
      this.currentFarmId = farm.id
      localStorage.setItem('lastFarmId', farm.id)
      this.selectedFarm = {
        id: farm.id,
        name: farm.name,
        code: farm.code,
      }

      await this.loadFarmState(farm.id)
      this.subscribeToFarm()
      this.subscribeToSessions()

      this.farmStatus = 'connected'
      this.startHeartbeat()
    },

    // replace existing disconnectFromFarm() with this
    async disconnectFromFarm() {
      // stop heartbeats & realtime first
      this.stopHeartbeat()

      if (this.unsubscribeRealtime) {
        this.unsubscribeRealtime()
        this.unsubscribeRealtime = null
      }

      // attempt to remove this user's session row immediately so presence is accurate
      try {
        const { data: userData } = await supabase.auth.getUser()
        const myId = userData?.user?.id ?? null

        if (myId && this.currentFarmId) {
          const { error } = await supabase
            .from('farm_sessions')
            .delete()
            .match({ farm_id: this.currentFarmId, user_id: myId })

          if (error) {
            console.warn('Failed to delete farm_session on disconnect:', error)
          }
        }
      } catch (err) {
        console.warn('Error while removing session on disconnect:', err)
      }

      // clear local state
      localStorage.removeItem('lastFarmId')
      this.currentFarmId = null
      this.farmSessionId = null
      this.selectedFarm = null
      this.activeSessionUserIds = []
      this.farmStatus = 'idle'
    },

    // ─────────────────────────────
    // Realtime Subscriptions
    // ─────────────────────────────
    subscribeToFarm() {
      if (!this.currentFarmId) return

      // clean previous subscription
      if (this.unsubscribeRealtime) {
        this.unsubscribeRealtime()
        this.unsubscribeRealtime = null
      }

      const channel = supabase
        .channel(`farm-${this.currentFarmId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'farm_state',
            filter: `farm_id=eq.${this.currentFarmId}`,
          },
          (payload) => {
            const entries = payload.new.state?.entries ?? {}

            this.progress.entryCompletedById = Object.fromEntries(
              Object.entries(entries).map(([key, value]) => [key, !!(value as { c?: boolean }).c]),
            )

            this.seasonCache = {}
            this.seasonCacheVersion++
          },
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            this.farmStatus = 'connected'
          }

          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            this.farmStatus = 'reconnecting'
          }
        })

      this.unsubscribeRealtime = () => {
        supabase.removeChannel(channel)
      }
    },

    subscribeToSessions() {
      if (!this.currentFarmId) return

      const farmId = this.currentFarmId

      const channel = supabase
        .channel(`farm-sessions-${farmId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'farm_sessions',
            filter: `farm_id=eq.${farmId}`,
          },
          async () => {
            const { data } = await supabase
              .from('farm_sessions')
              .select('user_id')
              .eq('farm_id', farmId)

            this.activeSessionUserIds = data?.map((r) => r.user_id) ?? []
          },
        )
        .subscribe()

      // Initial load
      supabase
        .from('farm_sessions')
        .select('user_id')
        .eq('farm_id', farmId)
        .then(({ data }) => {
          this.activeSessionUserIds = data?.map((r) => r.user_id) ?? []
        })

      const prevUnsub = this.unsubscribeRealtime

      this.unsubscribeRealtime = () => {
        if (prevUnsub) prevUnsub()
        supabase.removeChannel(channel)
      }
    },

    // ─────────────────────────────
    // Seat Heartbeat
    // ─────────────────────────────
    async heartbeatSeat() {
      if (!this.currentFarmId) return

      // Reuses claim_seat to refresh last_seen_at
      await supabase.rpc('claim_seat', {
        input_farm_id: this.currentFarmId,
      })
    },

    startHeartbeat() {
      if (this.heartbeatTimer) return

      this.heartbeatTimer = setInterval(() => {
        this.heartbeatSeat()
      }, 10000)
    },

    stopHeartbeat() {
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer)
        this.heartbeatTimer = null
      }
    },

    // ─────────────────────────────
    // Farm State
    // ─────────────────────────────
    async loadFarmState(farmId: string) {
      this.currentFarmId = farmId

      const { data, error } = await supabase
        .from('farm_state')
        .select('state')
        .eq('farm_id', farmId)
        .single()

      if (error || !data) {
        console.log('Failed to load farm state', error)
        return
      }

      const entries = data.state?.entries ?? {}

      const next: Record<string, boolean> = {}

      for (const entryKey in entries) {
        const value = entries[entryKey] as { c?: boolean }
        next[entryKey] = !!value?.c
      }

      this.progress.entryCompletedById = next

      this.seasonCache = {}
      this.seasonCacheVersion++
    },

    // ─────────────────────────────
    // State Import / Export
    // ─────────────────────────────
    async importStateCode(code: string) {
      if (!this.currentFarmId) return

      let payload: {
        schema: number
        entries: Record<string, { c?: boolean; t?: number }>
      }

      if (code.startsWith('SCC2:')) {
        const encoded = code.replace('SCC2:', '')
        const json = await this.gunzipString(encoded)
        payload = JSON.parse(json)
      } else if (code.startsWith('SCC1:')) {
        const encoded = code.replace('SCC1:', '')
        const json = atob(encoded)
        payload = JSON.parse(json)
      } else {
        throw new Error('Invalid state code')
      }

      // Validate schema version
      if (payload.schema !== STATE_SCHEMA_VERSION) {
        throw new Error(`Unsupported state schema version: ${payload.schema}`)
      }

      // Validate entries structure
      if (typeof payload.entries !== 'object' || payload.entries === null) {
        throw new Error('Invalid state payload structure')
      }

      await supabase.rpc('import_state_code', {
        input_farm_id: this.currentFarmId,
        input_payload: payload,
      })
    },

    async gzipString(input: string): Promise<string> {
      const stream = new CompressionStream('gzip')
      const writer = stream.writable.getWriter()
      writer.write(new TextEncoder().encode(input))
      writer.close()

      const compressed = await new Response(stream.readable).arrayBuffer()
      return btoa(String.fromCharCode(...new Uint8Array(compressed)))
    },

    async gunzipString(base64: string): Promise<string> {
      const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
      const stream = new DecompressionStream('gzip')
      const writer = stream.writable.getWriter()
      writer.write(bytes)
      writer.close()

      const decompressed = await new Response(stream.readable).arrayBuffer()
      return new TextDecoder().decode(decompressed)
    },

    async exportStateCode(): Promise<string | null> {
      if (!this.currentFarmId) return null

      const payload = {
        schema: 1,
        entries: Object.fromEntries(
          Object.entries(this.progress.entryCompletedById).map(([key, value]) => [
            key,
            {
              c: value,
              t: Date.now(),
            },
          ]),
        ),
      }

      const json = JSON.stringify(payload)
      const compressed = await this.gzipString(json)

      return `SCC2:${compressed}`
    },

    // ─────────────────────────────
    // Progress Mutations
    // ─────────────────────────────
    async toggleEntry(entryKey: string) {
      if (!this.currentFarmId) return

      const newValue = !this.progress.entryCompletedById[entryKey]

      // optimistic update
      this.progress.entryCompletedById[entryKey] = newValue
      this.seasonCache = {}
      this.seasonCacheVersion++

      await supabase.rpc('apply_delta', {
        input_farm_id: this.currentFarmId,
        input_entry_id: entryKey,
        input_checked: newValue,
        input_timestamp: Date.now(),
      })
    },

    setInventory(itemId: string, count: number) {
      const safe = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0
      this.progress.inventoryByItemId[itemId] = safe

      this.seasonCache = {}
      this.seasonCacheVersion++
    },

    resetProgress() {
      this.progress.entryCompletedById = {}
      this.progress.inventoryByItemId = {}

      this.seasonCache = {}
      this.seasonCacheVersion++
    },
  },
})
