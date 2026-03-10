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

export const useBundlesStore = defineStore('bundles', {
  state: () => ({
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

    // Bundles grouped by room (for room sorting UI)
    bundlesByRoomView() {
      return buildBundlesByRoomView({
        roomsById: this.roomsById,
        bundleIdsByRoomId: this.bundleIdsByRoomId,
        bundlesById: this.bundlesById,
        entryKeysByBundleId: this.entryKeysByBundleId,
        entriesByKey: this.entriesByKey,
        itemsById: this.itemsById,
        entryCompletedById: this.progress.entryCompletedById,
        getBundleProgress: this.bundleProgress,
        getRoomProgress: this.roomProgress,
      })
    },

    // Flat bundle list (sort by name)
    bundlesView() {
      return buildBundlesView({
        bundlesById: this.bundlesById,
        entryKeysByBundleId: this.entryKeysByBundleId,
        entriesByKey: this.entriesByKey,
        itemsById: this.itemsById,
        entryCompletedById: this.progress.entryCompletedById,
        getBundleProgress: this.bundleProgress,
      })
    },

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

      // attempt to remove this user's session row immediately so presence is accurate
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
      this.farmStatus = 'idle'
    },

    // ─────────────────────────────
    // Realtime Subscriptions
    // ─────────────────────────────
    subscribeToFarm() {
      if (!this.currentFarmId) return

      if (this.unsubscribeFarmChannel) {
        this.unsubscribeFarmChannel()
        this.unsubscribeFarmChannel = null
      }

      this.unsubscribeFarmChannel = createFarmStateChannel(this.currentFarmId, {
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

    subscribeToSessions() {
      if (!this.currentFarmId) return

      if (this.unsubscribeSessionChannel) {
        this.unsubscribeSessionChannel()
        this.unsubscribeSessionChannel = null
      }

      this.unsubscribeSessionChannel = createFarmSessionsChannel(this.currentFarmId, {
        onSessionUsersChange: (userIds) => {
          this.activeSessionUserIds = userIds
        },
      })
    },

    // ─────────────────────────────
    // Seat Heartbeat
    // ─────────────────────────────
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

      const payload = await parseStateCode(code)

      await supabase.rpc('import_state_code', {
        input_farm_id: this.currentFarmId,
        input_payload: payload,
      })
    },

    async exportStateCode(): Promise<string | null> {
      if (!this.currentFarmId) return null

      return await buildStateCode(this.progress.entryCompletedById)
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
