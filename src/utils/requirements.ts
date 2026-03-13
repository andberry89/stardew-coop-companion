import type { SeasonUsage } from '@/types'

// Create a stable key representing a bundle requirement based on
// quality level and quantity needed.
export function requirementKey(usage: SeasonUsage) {
  const quality = usage.minQuality ?? 'normal'
  const qty = usage.requiredPerSubmission ?? 1
  return `${quality}:${qty}`
}
