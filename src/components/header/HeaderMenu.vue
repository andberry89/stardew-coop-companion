<template>
  <div ref="menuRef" class="absolute left-4 top-4">
    <div class="border-menu grad-amber rounded-lg overflow-hidden w-56">
      <div
        class="flex items-center gap-2 px-4 py-2 cursor-pointer select-none"
        @click="menuOpen = !menuOpen"
      >
        <img
          v-if="currentAvatar"
          :src="`/images/avatars/${currentAvatar}-icon.png`"
          class="size-10 rounded border-2 border-yellow-900"
        />
        <span class="font-stardew-bold text-yellow-950">Menu</span>
      </div>

      <div
        class="transition-all duration-300 ease-in-out overflow-hidden"
        :class="menuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'"
      >
        <div class="px-4 pb-3 space-y-2">
          <button :class="menuButtonClass" @click="emit('account')">Account Page</button>

          <button :class="menuButtonClass" @click="emit('help')">Help & Support</button>

          <button :disabled="exportLoading" :class="menuButtonClass" @click="emit('export')">
            Export State
          </button>

          <button :disabled="importLoading" :class="menuButtonClass" @click="emit('import')">
            Import State
          </button>

          <button :disabled="logoutLoading" :class="dangerMenuButtonClass" @click="emit('logout')">
            Logout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

defineProps<{
  currentAvatar: string | null
  exportLoading: boolean
  importLoading: boolean
  logoutLoading: boolean
}>()

const emit = defineEmits<{
  (e: 'account'): void
  (e: 'help'): void
  (e: 'export'): void
  (e: 'import'): void
  (e: 'logout'): void
}>()

const menuButtonClass = 'w-full text-left px-2 py-1 rounded hover:bg-yellow-200 disabled:opacity-50'

const dangerMenuButtonClass =
  'w-full text-left px-2 py-1 rounded text-red-700 hover:bg-red-100 disabled:opacity-50'

const menuOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

function handleClickOutside(event: MouseEvent) {
  if (!menuOpen.value) return

  const target = event.target as Node

  if (menuRef.value && !menuRef.value.contains(target)) {
    menuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
