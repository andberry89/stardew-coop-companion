import { ref } from 'vue'

type ToastType = 'success' | 'error' | 'info'

type ToastItem = {
  id: number
  message: string
  type: ToastType
}

// Shared reactive toast list used across the application.
const toasts = ref<ToastItem[]>([])
let nextToastId = 1

function show(message: string, type: ToastType) {
  const id = nextToastId++
  toasts.value.push({ id, message, type })

  // Automatically remove the toast after the display duration.
  window.setTimeout(() => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }, 3000)
}

export function useToast() {
  return {
    toasts,
    success(message: string) {
      show(message, 'success')
    },
    error(message: string) {
      show(message, 'error')
    },
    info(message: string) {
      show(message, 'info')
    },
    remove(id: number) {
      toasts.value = toasts.value.filter((toast) => toast.id !== id)
    },
  }
}
