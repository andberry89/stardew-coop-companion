import type { Item } from '@/types'

// Describes where a seasonal item is used across bundles.
export type SeasonUsage = {
  entryKey: string
  bundleId: string
  bundleName: string
  completed: boolean
  requiredPerSubmission: number
  minQuality?: string
}

// Seasonal view item entry including current inventory and bundle usages.
export type SeasonItemEntry = {
  item: Item
  inventory: number
  usages: SeasonUsage[]
}

// Flattened row structure used by the Seasonal tracker UI.
export type SeasonDisplayRow = {
  item: SeasonItemEntry['item']
  inventory: number
  requirement: {
    minQuality?: string
    requiredPerSubmission: number
  }
  usages: SeasonUsage[]
}
