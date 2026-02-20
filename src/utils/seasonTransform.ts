import type { SeasonItemEntry, SeasonDisplayRow } from '@/types'
import { requirementKey } from './requirements'

export function splitEntryIntoRows(entry: SeasonItemEntry): SeasonDisplayRow[] {
  const map = new Map<string, SeasonDisplayRow>()

  for (const usage of entry.usages) {
    const key = requirementKey(usage)

    if (!map.has(key)) {
      map.set(key, {
        item: entry.item,
        inventory: entry.inventory,
        requirement: {
          minQuality: usage.minQuality ?? undefined,
          requiredPerSubmission: usage.requiredPerSubmission ?? 1,
        },
        usages: [],
      })
    }

    map.get(key)!.usages.push(usage)
  }

  return Array.from(map.values())
}
