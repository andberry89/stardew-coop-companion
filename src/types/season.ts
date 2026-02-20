import type { Item } from '@/types'

export type SeasonUsage = {
  entryKey: string
  bundleId: string
  bundleName: string
  completed: boolean
  requiredPerSubmission: number
  minQuality?: string
}

export type SeasonItemEntry = {
  item: Item
  inventory: number
  usages: SeasonUsage[]
}

export type SeasonDisplayRow = {
  item: SeasonItemEntry['item']
  inventory: number
  requirement: {
    minQuality?: string
    requiredPerSubmission: number
  }
  usages: SeasonUsage[]
}
