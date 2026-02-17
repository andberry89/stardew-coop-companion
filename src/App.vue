<template>
  <div class="max-w-7xl mx-auto my-0 p-4 relative flex flex-col">
    <header class="relative flex items-start justify-center mb-6">
      <div class="flex flex-col text-center items-center">
        <img src="/images/main-logo.png" alt="Stardew Valley Logo" class="center mb-4 size-[70%]" />
        <h1 class="text-lg font-stardew-bold text-white">CO-OP COMPANION</h1>
      </div>
      <div
        class="border-menu grad-background absolute top-4 right-4 px-4 py-2 rounded-lg text-sm font-quicksand"
      >
        <p><span class="font-bold">Partner:</span> Casey</p>
        <p><span class="font-bold">Farm:</span> Isen-Farm</p>
        <p><span class="font-bold">State Code:</span> A43F00A</p>
      </div>
    </header>
    <nav
      class="border-menu grad-background flex items-start justify-center gap-4 py-4 px-20 rounded-lg w-fit self-center mb-6"
    >
      <button class="border-menu bg-amber-200 py-2 px-4 font-stardew-thin text-orange-950">
        Bundles
      </button>
      <button class="border-menu bg-amber-200 py-2 px-4 font-stardew-thin text-orange-950">
        Seasons
      </button>
    </nav>
    <main class="flex items-start justify-between w-full gap-4">
      <section
        class="w-64 border-menu grad-background px-4 py-2 rounded-lg flex flex-col items-center gap-4 font-stardew-thin text-orange-950"
      >
        <h2 class="font-stardew-bold">Filter</h2>
        <button class="border-menu bg-amber-200 p-2 flex gap-2 items-center w-[90%]">
          <img src="/images/seasons/spring.png" alt="Spring" />Spring
        </button>
        <button class="border-menu bg-amber-200 p-2 flex gap-2 items-center w-[90%]">
          <img src="/images/seasons/summer.png" alt="Summer" />Summer
        </button>
        <button class="border-menu bg-amber-200 p-2 flex gap-2 items-center w-[90%]">
          <img src="/images/seasons/fall.png" alt="Fall" />Fall
        </button>
        <button class="border-menu bg-amber-200 p-2 flex gap-2 items-center w-[90%]">
          <img src="/images/seasons/winter.png" alt="Winter" />Winter
        </button>
        <button class="border-menu bg-amber-200 p-2 flex gap-2 items-center w-[90%]">
          <img src="/images/seasons/all-seasons.png" alt="All Seasons" />All
        </button>
      </section>
      <section class="flex flex-col flex-1">
        <div class="flex flex-col border-menu grad-background px-4 py-2 rounded-lg">
          <h2 class="text-2xl font-stardew-bold text-orange-950 p-4">>Crafts Room</h2>
          <div class="flex gap-4">
            <div class="flex flex-col justify-start gap-4 bg-amber-200 p-4 border-menu w-[40%]">
              <h3 class="text-lg font-stardew-bold text-orange-950 mb-4">Spring Foraging</h3>
              <div class="flex justify-between">
                <div class="flex flex-col justify-center text-center">
                  <div class="bg-orange-300 border-menu flex justify-center p-0.5">
                    <img
                      src="/images/items/wild-horseradish.png"
                      alt="Wild Horseradish"
                      class="size-12"
                    />
                  </div>
                  <p
                    class="font-quicksand text-sm w-18 overflow-hidden overflow-ellipsis font-display whitespace-nowrap"
                  >
                    Wild Horseradish
                  </p>
                </div>
                <div class="flex flex-col justify-center text-center">
                  <div class="bg-orange-300 border-menu flex justify-center p-0.5">
                    <img src="/images/items/daffodil.png" alt="Daffodil" class="size-12" />
                  </div>
                  <p
                    class="font-quicksand text-sm w-18 overflow-hidden overflow-ellipsis font-display whitespace-nowrap"
                  >
                    Daffodil
                  </p>
                </div>
                <div class="flex flex-col justify-center text-center">
                  <div class="bg-orange-300 border-menu flex justify-center p-0.5">
                    <img src="/images/items/leek.png" alt="Leek" class="size-12" />
                  </div>
                  <p
                    class="font-quicksand text-sm w-18 overflow-hidden overflow-ellipsis font-display whitespace-nowrap"
                  >
                    Leek
                  </p>
                </div>
                <div class="flex flex-col justify-center text-center">
                  <div class="bg-orange-300 border-menu flex justify-center p-0.5">
                    <img src="/images/items/dandelion.png" alt="Dandelion" class="size-12" />
                  </div>
                  <p
                    class="font-quicksand text-sm w-18 overflow-hidden overflow-ellipsis font-display whitespace-nowrap"
                  >
                    Dandelion
                  </p>
                </div>
              </div>
              <div class="flex justify-start gap-1">
                <div class="slot size-12"></div>
                <div class="slot size-12"></div>
                <div class="slot size-12"></div>
                <div class="slot size-12"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
  <div class="opacity-0">
    {{ view }}
    {{ seasonItems }}
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
