import type { Quality } from '@/types'

export function qualityIconFor(quality?: Quality | string | null) {
  if (!quality) return null

  switch (quality) {
    case 'silver':
      return '/images/icons/silver-quality-icon.png'
    case 'gold':
      return '/images/icons/gold-quality-icon.png'
    case 'iridium':
      return '/images/icons/iridium-quality-icon.png'
    default:
      return null
  }
}
