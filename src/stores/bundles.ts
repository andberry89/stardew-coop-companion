// src/stores/bundles.ts
import { defineStore } from 'pinia'
import {
  claimFarmSeat,
  createFarmSessionsChannel,
  createFarmStateChannel,
  removeFarmSession,
} from '@/lib/bundles/connection'
import { buildCatalogState, type CatalogPayload } from '@/lib/bundles/catalog'
import {
  getBundleProgress,
  getCompletedItemsForBundle,
  getRoomProgress,
} from '@/lib/bundles/progress'
import { buildSeasonView } from '@/lib/bundles/seasonView'
import { buildBundlesByRoomView, buildBundlesView } from '@/lib/bundles/views'
import { buildStateCode, parseStateCode } from '@/lib/bundles/stateCode'
import { supabase } from '@/lib/supabase'
import { getProfilesByIds } from '@/lib/profiles'

import type {
  Bundle,
  BundleEntry,
  FarmConnectionStatus,
  Item,
  Progress,
  Room,
  RoomId,
  Season,
  SeasonItemEntry,
  SelectedFarm,
} from '@/types'

type BundlesState = {
  currentFarmId: string | null
  selectedFarm: SelectedFarm | null
  farmSessionId: string | null
  farmStatus: FarmConnectionStatus
  heartbeatTimer: ReturnType<typeof setInterval> | null
  unsubscribeFarmChannel: (() => void) | null
  unsubscribeSessionChannel: (() => void) | null
  activeSessionUserIds: string[]
  activeSessionPlayers: ActiveFarmPlayer[]
  roomsById: Record<RoomId, Room>
  itemsById: Record<string, Item>
  bundlesById: Record<string, Bundle>
  entriesByKey: Record<string, BundleEntry>
  bundleIdsByRoomId: Record<RoomId, string[]>
  entryKeysByBundleId: Record<string, string[]>
  bundleIdsByItemId: Record<string, string[]>
  itemIdsBySeason: Record<Season, string[]>
  entryKeysByItemId: Record<string, string[]>
  seasonCache: Partial<Record<Season, SeasonItemEntry[]>>
  seasonCacheVersion: number
  progress: Progress
}

export const useBundlesStore = defineStore('bundles', {
  state: (): BundlesState => ({
    // ─────────────────────────────
    // Farm Connection State
    // ─────────────────────────────
    currentFarmId: null as string | null,
    selectedFarm: null as SelectedFarm | null,

    farmSessionId: null as string | null,
    farmStatus: 'idle' as FarmConnectionStatus,

    heartbeatTimer: null as ReturnType<typeof setInterval> | null,
    unsubscribeFarmChannel: null as (() => void) | null,
    unsubscribeSessionChannel: null as (() => void) | null,
    activeSessionUserIds: [] as string[],
    activeSessionPlayers: [] as ActiveFarmPlayer[],

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
    // Cached season rows are rebuilt whenever synced progress or local inventory changes.
    seasonCache: {},
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
    // ─────────────────────────────
    // Progress Helpers
    // ─────────────────────────────
    isEntryCompleted: (s) => {
      return (entryKey: string) =>
        !!s.progress.entryCompletedById[entryKey as keyof typeof s.progress.entryCompletedById]
    },

    completedItemsForBundle: (s) => {
      return (bundleId: string) => {
        const entryKeys = s.entryKeysByBundleId[bundleId] ?? []

        return getCompletedItemsForBundle(
          entryKeys,
          s.progress.entryCompletedById,
          s.entriesByKey,
          s.itemsById,
        )
      }
    },

    bundleProgress: (s) => {
      return (bundleId: string) => {
        const entryKeys = s.entryKeysByBundleId[bundleId] ?? []
        const requiredCount = s.bundlesById[bundleId]?.requiredCount ?? 0

        return getBundleProgress(entryKeys, s.progress.entryCompletedById, requiredCount)
      }
    },

    roomProgress: (s) => {
      return (roomId: RoomId) => {
        return getRoomProgress(
          roomId,
          s.bundleIdsByRoomId,
          s.entryKeysByBundleId,
          s.progress.entryCompletedById,
          s.bundlesById,
        )
      }
    },

    // ─────────────────────────────
    // Bundle / Room Views
    // ─────────────────────────────

    // Bundles grouped by room (for room sorting UI)
    bundlesByRoomView: (s) => {
      return buildBundlesByRoomView({
        roomsById: s.roomsById,
        bundleIdsByRoomId: s.bundleIdsByRoomId,
        bundlesById: s.bundlesById,
        entryKeysByBundleId: s.entryKeysByBundleId,
        entriesByKey: s.entriesByKey,
        itemsById: s.itemsById,
        entryCompletedById: s.progress.entryCompletedById as Record<string, boolean>,
        getBundleProgress: (bundleId: string) => {
          const entryKeys = s.entryKeysByBundleId[bundleId] ?? []
          const requiredCount = s.bundlesById[bundleId]?.requiredCount ?? 0

          return getBundleProgress(entryKeys, s.progress.entryCompletedById, requiredCount)
        },
        getRoomProgress: (roomId: RoomId) => {
          return getRoomProgress(
            roomId,
            s.bundleIdsByRoomId,
            s.entryKeysByBundleId,
            s.progress.entryCompletedById,
            s.bundlesById,
          )
        },
      })
    },

    // Flat bundle list (sort by name)
    bundlesView: (s) => {
      return buildBundlesView({
        bundlesById: s.bundlesById,
        entryKeysByBundleId: s.entryKeysByBundleId,
        entriesByKey: s.entriesByKey,
        itemsById: s.itemsById,
        entryCompletedById: s.progress.entryCompletedById as Record<string, boolean>,
        getBundleProgress: (bundleId: string) => {
          const entryKeys = s.entryKeysByBundleId[bundleId] ?? []
          const requiredCount = s.bundlesById[bundleId]?.requiredCount ?? 0

          return getBundleProgress(entryKeys, s.progress.entryCompletedById, requiredCount)
        },
      })
    },

    // ─────────────────────────────
    // Seasonal View
    // ─────────────────────────────

    // Season view (items + per-bundle usages)
    seasonView: (s) => {
      return (season: Season): SeasonItemEntry[] => {
        if (s.seasonCache[season]) {
          return s.seasonCache[season]
        }

        const result = buildSeasonView({
          season,
          itemIdsBySeason: s.itemIdsBySeason,
          itemsById: s.itemsById,
          entryKeysByItemId: s.entryKeysByItemId,
          entriesByKey: s.entriesByKey,
          bundlesById: s.bundlesById,
          progress: s.progress,
        })

        s.seasonCache[season] = result
        return result
      }
    },

    // ─────────────────────────────
    // View Utilities
    // ─────────────────────────────

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
      const catalogState = buildCatalogState(payload)

      this.roomsById = catalogState.roomsById
      this.itemsById = catalogState.itemsById
      this.bundlesById = catalogState.bundlesById
      this.entriesByKey = catalogState.entriesByKey
      this.bundleIdsByRoomId = catalogState.bundleIdsByRoomId
      this.entryKeysByBundleId = catalogState.entryKeysByBundleId
      this.bundleIdsByItemId = catalogState.bundleIdsByItemId
      this.itemIdsBySeason = catalogState.itemIdsBySeason
      this.entryKeysByItemId = catalogState.entryKeysByItemId
    },

    // ─────────────────────────────
    // Farm Connection Lifecycle
    // ─────────────────────────────

    // Establish a realtime connection to a farm.
    // The sequence is important:
    // 1. claim an active seat
    // 2. load the current farm state
    // 3. subscribe to realtime updates and session presence
    // 4. start the seat heartbeat to keep the connection alive
    async connectToFarm(farm: SelectedFarm) {
      this.stopHeartbeat()
      this.farmStatus = 'connecting'

      const { data, error } = await claimFarmSeat(farm.id)

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

    // Cleanly disconnect from the current farm by stopping realtime
    // subscriptions, removing the active session row, and clearing
    // local connection state.
    async disconnectFromFarm() {
      // stop heartbeats & realtime first
      this.stopHeartbeat()

      if (this.unsubscribeFarmChannel) {
        this.unsubscribeFarmChannel()
        this.unsubscribeFarmChannel = null
      }

      if (this.unsubscribeSessionChannel) {
        this.unsubscribeSessionChannel()
        this.unsubscribeSessionChannel = null
      }

      // Remove this session row on disconnect so active-seat tracking stays accurate
      // even before any backend cleanup or timeout logic runs.
      try {
        const { data: userData } = await supabase.auth.getUser()
        const myId = userData?.user?.id ?? null

        if (myId && this.currentFarmId) {
          const { error } = await removeFarmSession(this.currentFarmId, myId)

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
      this.activeSessionPlayers = []
      this.farmStatus = 'idle'
    },

    // ─────────────────────────────
    // Realtime Subscriptions
    // ─────────────────────────────

    // Subscribe to realtime farm_state updates and map them into
    // the store's entryCompletedById progress state.
    subscribeToFarm() {
      if (!this.currentFarmId) return

      if (this.unsubscribeFarmChannel) {
        this.unsubscribeFarmChannel()
        this.unsubscribeFarmChannel = null
      }

      this.unsubscribeFarmChannel = createFarmStateChannel(this.currentFarmId, {
        // Convert the stored state payload into the local progress map
        // and invalidate seasonal view caches.
        onStateUpdate: (entries) => {
          this.progress.entryCompletedById = Object.fromEntries(
            Object.entries(entries).map(([key, value]) => [key, !!(value as { c?: boolean }).c]),
          )

          this.seasonCache = {}
          this.seasonCacheVersion++
        },
        onStatusChange: (status) => {
          this.farmStatus = status
        },
      })
    },

    // Subscribe to farm session presence changes so the UI can reflect
    // the current co-op player roster.
    async refreshActiveSessionPlayers() {
      if (!this.activeSessionUserIds.length) {
        this.activeSessionPlayers = []
        return
      }

      try {
        const profiles = await getProfilesByIds(this.activeSessionUserIds)

        const profileById = Object.fromEntries(
          profiles.map((p) => [
            p.id,
            {
              displayName: p.display_name?.trim() || 'Unknown Farmer',
              avatar: p.avatar ?? null,
            },
          ]),
        )

        this.activeSessionPlayers = this.activeSessionUserIds.map((userId) => {
          const profile = profileById[userId]

          return {
            id: userId,
            displayName: profile?.displayName ?? 'Unknown Farmer',
            avatar: profile?.avatar ?? null,
          }
        })
      } catch (error) {
        console.warn('Failed to load active session players:', error)

        this.activeSessionPlayers = this.activeSessionUserIds.map((userId) => ({
          id: userId,
          displayName: 'Unknown Farmer',
          avatar: null,
        }))
      }
    },

    // Track active users connected to the farm so the UI can reflect
    // co-op presence (e.g., partner display and seat count).
    subscribeToSessions() {
      if (!this.currentFarmId) return

      if (this.unsubscribeSessionChannel) {
        this.unsubscribeSessionChannel()
        this.unsubscribeSessionChannel = null
      }

      this.unsubscribeSessionChannel = createFarmSessionsChannel(this.currentFarmId, {
        onSessionUsersChange: async (userIds) => {
          this.activeSessionUserIds = userIds
          await this.refreshActiveSessionPlayers()
        },
      })
    },

    // ─────────────────────────────
    // Seat Heartbeat
    // ─────────────────────────────

    // Periodically re-claim the seat to keep this client counted as
    // an active farm session.
    async heartbeatSeat() {
      if (!this.currentFarmId) return

      await claimFarmSeat(this.currentFarmId)
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

    // Initial farm state hydration before realtime updates begin.
    // Loads the persisted farm_state row and rebuilds the progress map.
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

      this.progress.entryCompletedById = next as Progress['entryCompletedById']

      this.seasonCache = {}
      this.seasonCacheVersion++
    },

    // ─────────────────────────────
    // State Import / Export
    // ─────────────────────────────

    // Replace the current farm progress using an imported state code.
    async importStateCode(code: string) {
      if (!this.currentFarmId) return

      const payload = await parseStateCode(code)

      await supabase.rpc('import_state_code', {
        input_farm_id: this.currentFarmId,
        input_payload: payload,
      })
    },

    // Generate a shareable state code representing the current
    // bundle completion state for this farm.
    async exportStateCode(): Promise<string | null> {
      if (!this.currentFarmId) return null

      return await buildStateCode(this.progress.entryCompletedById)
    },

    // ─────────────────────────────
    // Progress Mutations
    // ─────────────────────────────

    // Toggle bundle entry completion with an optimistic update so
    // the UI reflects the change immediately while the server update runs.
    async toggleEntry(entryKey: string) {
      if (!this.currentFarmId) return

      const progressKey = entryKey as keyof typeof this.progress.entryCompletedById
      const newValue = !this.progress.entryCompletedById[progressKey]

      // optimistic update
      this.progress.entryCompletedById[progressKey] = newValue
      this.seasonCache = {}
      this.seasonCacheVersion++

      await supabase.rpc('apply_delta', {
        input_farm_id: this.currentFarmId,
        input_entry_id: entryKey,
        input_checked: newValue,
        input_timestamp: Date.now(),
      })
    },

    // Update local inventory counts used by the seasonal tracker view.
    setInventory(itemId: string, count: number) {
      const safe = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0
      this.progress.inventoryByItemId[itemId] = safe

      this.seasonCache = {}
      this.seasonCacheVersion++
    },

    // Clear all tracked progress and inventory state locally.
    resetProgress() {
      this.progress.entryCompletedById = {} as Progress['entryCompletedById']
      this.progress.inventoryByItemId = {}

      this.seasonCache = {}
      this.seasonCacheVersion++
    },
  },
})
