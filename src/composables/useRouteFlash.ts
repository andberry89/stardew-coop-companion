import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { clearFlashQuery, readFlashQuery } from '@/lib/flash'

// Shows cross-route toast feedback after navigation, such as
// connecting to a farm or finishing a password reset flow.
export function useRouteFlash() {
  const route = useRoute()
  const router = useRouter()
  const toast = useToast()

  onMounted(() => {
    const flash = readFlashQuery(route.query)

    if (!flash) {
      return
    }

    if (flash.type === 'error') {
      toast.error(flash.message)
    } else {
      toast.success(flash.message)
    }
    // Remove flash params after showing the toast so the message
    // does not appear again if the page is refreshed.
    router.replace({ query: clearFlashQuery(route.query) })
  })
}
