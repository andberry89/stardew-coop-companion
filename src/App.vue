<template>
  <router-view />
  <ToastStack />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/lib/supabase'
import { useBundlesStore } from '@/stores/bundles'
import ToastStack from '@/components/ui/ToastStack.vue'

const router = useRouter()
const store = useBundlesStore()

let unsubscribeAuth: (() => void) | null = null

async function goToLoggedOutState() {
  if (router.currentRoute.value.path !== '/login') {
    await router.replace('/login')
  }

  await store.disconnectFromFarm()
}

async function goToLoggedInState() {
  if (router.currentRoute.value.path === '/login') {
    await router.replace('/account')
  }
}

onMounted(() => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    window.setTimeout(async () => {
      const isLoggedOut =
        event === 'SIGNED_OUT' ||
        event === 'TOKEN_REFRESH_FAILED' ||
        (event === 'INITIAL_SESSION' && !session)

      if (isLoggedOut) {
        await goToLoggedOutState()
        return
      }

      const isLoggedIn =
        event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED'

      if (isLoggedIn && session) {
        await goToLoggedInState()
      }

      if (event === 'PASSWORD_RECOVERY') {
        if (router.currentRoute.value.path !== '/login') {
          await router.replace('/login')
        }
      }
    }, 0)
  })

  unsubscribeAuth = () => {
    subscription.unsubscribe()
  }
})

onUnmounted(() => {
  unsubscribeAuth?.()
})
</script>
