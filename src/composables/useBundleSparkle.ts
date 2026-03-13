import { ref } from 'vue'

type Sparkle = {
  id: number
  top: string
  left: string
  rotate: number
  size: string
  delay: string
}
// Generates the sparkle effect shown when a bundle requirement
// is completed in the tracker UI.

export function useBundleSparkle(requiredCount: number) {
  const sparkles = ref<Sparkle[]>([])
  const showSparkle = ref(false)

  // Scatter sparkles across the bundle area so the completion effect
  // feels less uniform each time it runs.
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
    // Rebuild the sparkle layout on each trigger so the animation
    // does not look exactly the same every time.
    generateSparkles()
    showSparkle.value = true

    // Hide sparkles after the animation finishes.
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
