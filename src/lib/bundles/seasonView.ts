import type { Bundle, BundleEntry, Item, Progress, Season, SeasonItemEntry } from '@/types'

export type BuildSeasonViewInput = {
  season: Season
  itemIdsBySeason: Record<Season, string[]>
  itemsById: Record<string, Item>
  entryKeysByItemId: Record<string, string[]>
  entriesByKey: Record<string, BundleEntry>
  bundlesById: Record<string, Bundle>
  progress: Progress
}

export function buildSeasonView({
  season,
  itemIdsBySeason,
  itemsById,
  entryKeysByItemId,
  entriesByKey,
  bundlesById,
  progress,
}: BuildSeasonViewInput): SeasonItemEntry[] {
  const itemIds =
    season === 'any'
      ? (itemIdsBySeason.any ?? [])
      : [...(itemIdsBySeason[season] ?? []), ...(itemIdsBySeason.any ?? [])]

  const result: SeasonItemEntry[] = []

  for (const itemId of itemIds) {
    const item = itemsById[itemId]
    if (!item) {
      continue
    }

    const entryKeys = entryKeysByItemId[itemId] ?? []
    const usages: SeasonItemEntry['usages'] = []

    for (const entryKey of entryKeys) {
      const entry = entriesByKey[entryKey]
      if (!entry) {
        continue
      }

      const bundle = bundlesById[entry.bundleId]

      usages.push({
        entryKey,
        bundleId: entry.bundleId,
        bundleName: bundle?.name ?? entry.bundleId,
        completed:
          !!progress.entryCompletedById[entryKey as keyof typeof progress.entryCompletedById],
        requiredPerSubmission: entry.requiredPerSubmission ?? 1,
        minQuality: entry.minQuality,
      })
    }

    result.push({
      item,
      inventory: progress.inventoryByItemId[itemId] ?? 0,
      usages,
    })
  }

  return result.sort((a, b) => a.item.name.localeCompare(b.item.name))
}
