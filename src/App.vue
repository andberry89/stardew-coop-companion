<template>
  <div style="padding: 20px; max-width: 900px; margin: 0 auto">
    <h1 class="font-stardew-bold text-2xl">Bundles</h1>

    <div style="display: flex; gap: 8px; margin-bottom: 16px">
      <button @click="view = 'bundle'" :disabled="view === 'bundle'">By Bundle</button>
      <button @click="view = 'season'" :disabled="view === 'season'">By Season</button>
    </div>

    <!-- =============== BY BUNDLE (ROOMS) =============== -->
    <div v-if="view === 'bundle'">
      <div
        v-for="roomSection in store.bundlesByRoomView"
        :key="roomSection.room.id"
        style="margin-bottom: 40px"
      >
        <h2>
          {{ roomSection.room.name }}
          ({{ roomSection.progress.completedBundles }} / {{ roomSection.progress.totalBundles }})
        </h2>

        <img
          :src="
            roomSection.progress.isComplete ? roomSection.room.imgAfter : roomSection.room.imgBefore
          "
          alt=""
          style="max-width: 300px; display: block; margin-bottom: 16px"
        />

        <div
          v-for="bundleSection in roomSection.bundles"
          :key="bundleSection.bundle.id"
          style="border: 1px solid #ccc; padding: 12px; margin-bottom: 16px"
        >
          <h3>
            {{ bundleSection.bundle.name }}
            ({{ bundleSection.progress.completed }} / {{ bundleSection.progress.required }})
          </h3>

          <div style="margin-bottom: 8px">
            Reward: {{ bundleSection.bundle.reward }}
            <img
              v-if="bundleSection.bundle.rewardImg"
              :src="bundleSection.bundle.rewardImg"
              alt=""
              style="height: 32px; vertical-align: middle; margin-left: 8px"
            />
          </div>

          <ul style="list-style: none; padding-left: 0">
            <li v-for="row in bundleSection.rows" :key="row.entryKey" style="margin-bottom: 6px">
              <label>
                <input
                  type="checkbox"
                  :checked="row.completed"
                  @change="store.toggleEntry(row.entryKey)"
                />
                <span v-if="row.item">{{ row.item.name }}</span>
                <span v-else>(options)</span>

                <span v-if="row.entry.requiredPerSubmission && row.entry.requiredPerSubmission > 1">
                  ×{{ row.entry.requiredPerSubmission }}
                </span>

                <span v-if="row.entry.minQuality"> ({{ row.entry.minQuality }}+) </span>
              </label>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- =============== BY SEASON =============== -->
    <div v-else>
      <div style="display: flex; gap: 8px; margin-bottom: 16px">
        <button @click="selectedSeason = 'spring'" :disabled="selectedSeason === 'spring'">
          Spring
        </button>
        <button @click="selectedSeason = 'summer'" :disabled="selectedSeason === 'summer'">
          Summer
        </button>
        <button @click="selectedSeason = 'fall'" :disabled="selectedSeason === 'fall'">Fall</button>
        <button @click="selectedSeason = 'winter'" :disabled="selectedSeason === 'winter'">
          Winter
        </button>
      </div>

      <div
        v-for="row in seasonItems"
        :key="row.item.id"
        style="border: 1px solid #ddd; padding: 10px; margin-bottom: 10px"
      >
        <div style="display: flex; justify-content: space-between; gap: 12px">
          <div>
            <strong>{{ row.item.name }}</strong>
            <div style="font-size: 12px; opacity: 0.8">
              {{ row.item.sources.join(' • ') }}
            </div>
          </div>

          <div style="font-size: 12px">
            Inventory:
            <input
              type="number"
              min="0"
              :value="row.inventory"
              @input="
                store.setInventory(row.item.id, Number(($event.target as HTMLInputElement).value))
              "
              style="width: 80px"
            />
          </div>
        </div>

        <div v-if="row.usages.length" style="margin-top: 8px">
          <div style="font-size: 12px; opacity: 0.8; margin-bottom: 4px">Used in:</div>
          <ul style="list-style: none; padding-left: 0; margin: 0">
            <li v-for="u in row.usages" :key="u.entryKey" style="margin-bottom: 4px">
              <label>
                <input
                  type="checkbox"
                  :checked="u.completed"
                  @change="store.toggleEntry(u.entryKey)"
                />
                {{ u.bundleName }}
                <span v-if="u.requiredPerSubmission > 1">×{{ u.requiredPerSubmission }}</span>
                <span v-if="u.minQuality">({{ u.minQuality }}+)</span>
                <span v-if="u.isOption" style="opacity: 0.7">(option)</span>
              </label>
            </li>
          </ul>
        </div>

        <div v-else style="margin-top: 8px; font-size: 12px; opacity: 0.7">
          Not used in any bundles.
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBundlesStore } from '@/stores/bundles'
import type { Season } from '@/types/bundles'

const store = useBundlesStore()

const view = ref<'bundle' | 'season'>('bundle')
const selectedSeason = ref<Season>('spring')

const seasonItems = computed(() => store.seasonView(selectedSeason.value))
</script>
<style scoped></style>
