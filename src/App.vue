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

// Password recovery uses the login page in reset mode, so auth redirects
// should not interfere while the user is choosing a new password.
function isResetRoute() {
  return (
    router.currentRoute.value.path === '/login' && router.currentRoute.value.query.mode === 'reset'
  )
}

// Move the app into its logged-out state by returning to the login page
// and disconnecting any active farm session in the store.
async function goToLoggedOutState() {
  if (isResetRoute()) {
    return
  }

  if (router.currentRoute.value.path !== '/login') {
    await router.replace('/login')
  }

  await store.disconnectFromFarm()
}

// If the user is authenticated and still sitting on the login page,
// send them to the account page instead.
async function goToLoggedInState() {
  if (isResetRoute()) {
    return
  }

  if (router.currentRoute.value.path === '/login') {
    await router.replace('/account')
  }
}

onMounted(() => {
  const {
    data: { subscription },
    // Handle global auth lifecycle changes in one place so routing and
    // farm connection cleanup stay in sync with Supabase auth state.
  } = supabase.auth.onAuthStateChange((event, session) => {
    // Defer route and store updates until the current auth event finishes
    // so navigation does not race with Supabase's internal state changes.
    window.setTimeout(async () => {
      if (event === 'PASSWORD_RECOVERY') {
        if (!isResetRoute()) {
          await router.replace('/login?mode=reset')
        }

        return
      }

      const isLoggedOut = event === 'SIGNED_OUT' || (event === 'INITIAL_SESSION' && !session)

      if (isLoggedOut) {
        await goToLoggedOutState()
        return
      }

      const isLoggedIn =
        event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED'

      if (isLoggedIn && session) {
        await goToLoggedInState()
      }
    }, 0)
  })

  unsubscribeAuth = () => {
    subscription.unsubscribe()
  }
})

// Keep a cleanup reference so the auth listener is removed
// when the root app component unmounts.
onUnmounted(() => {
  unsubscribeAuth?.()
})
</script>
