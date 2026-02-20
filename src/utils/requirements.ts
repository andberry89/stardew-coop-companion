import type { SeasonUsage } from '@/types'

export function requirementKey(usage: SeasonUsage) {
  const quality = usage.minQuality ?? 'normal'
  const qty = usage.requiredPerSubmission ?? 1
  return `${quality}:${qty}`
}
