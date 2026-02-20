import { ref } from 'vue'

type Sparkle = {
  id: number
  top: string
  left: string
  rotate: number
  size: string
  delay: string
}

export function useBundleSparkle(requiredCount: number) {
  const sparkles = ref<Sparkle[]>([])
  const showSparkle = ref(false)

  function generateSparkles() {
    sparkles.value = Array.from({ length: requiredCount }).map((_, i) => ({
      id: i,
      top: `${20 + Math.random() * 60}%`,
      left: `${20 + Math.random() * 60}%`,
      rotate: Math.random() * 60 - 30,
      size: `${18 + Math.random() * 8}px`,
      delay: `${i * 0.15}s`,
    }))
  }

  function triggerSparkle() {
    generateSparkles()
    showSparkle.value = true

    setTimeout(() => {
      showSparkle.value = false
    }, 900)
  }

  return {
    sparkles,
    showSparkle,
    triggerSparkle,
  }
}
