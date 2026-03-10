import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import { clearFlashQuery, readFlashQuery } from '@/lib/flash'

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

    router.replace({ query: clearFlashQuery(route.query) })
  })
}
