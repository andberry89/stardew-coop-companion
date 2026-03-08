<template>
  <div class="border-4 border-blue-900 grad-blue rounded-lg p-6 space-y-6 shadow-md">
    <h2 class="text-xl font-stardew-bold text-blue-950">Manage Farms</h2>

    <div class="grid md:grid-cols-2 gap-6">
      <div class="space-y-3">
        <h3 class="font-stardew-bold text-blue-950">Create Farm</h3>

        <input
          :value="newFarmName"
          placeholder="Farm name"
          class="border-menu bg-blue-50 rounded px-3 py-2 w-full"
          @input="handleNewFarmNameInput"
        />

        <button
          :disabled="createFarmLoading"
          class="border-menu grad-blue py-2 px-4 font-stardew-thin text-blue-950 stardew-btn disabled:opacity-50"
          @click="emit('create')"
        >
          Create
        </button>
      </div>

      <div class="space-y-3">
        <h3 class="font-stardew-bold text-blue-950">Join Farm</h3>

        <input
          :value="joinCode"
          placeholder="Enter farm code"
          class="border-menu bg-blue-50 rounded px-3 py-2 w-full"
          @input="handleJoinCodeInput"
        />

        <button
          :disabled="joinFarmLoading || !joinCode.trim()"
          class="border-menu grad-blue py-2 px-4 font-stardew-thin text-blue-950 stardew-btn disabled:opacity-50"
          @click="emit('join')"
        >
          Join
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  newFarmName: string
  joinCode: string
  createFarmLoading: boolean
  joinFarmLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'create'): void
  (e: 'join'): void
  (e: 'update:newFarmName', value: string): void
  (e: 'update:joinCode', value: string): void
}>()

function handleNewFarmNameInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:newFarmName', target.value)
}

function handleJoinCodeInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:joinCode', target.value)
}
</script>
