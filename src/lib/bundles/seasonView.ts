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

// Build the data used by the Seasonal tracker view.
// Combines catalog data and current progress to show which bundles
// use each seasonal item and whether those entries are complete.
export function buildSeasonView({
  season,
  itemIdsBySeason,
  itemsById,
  entryKeysByItemId,
  entriesByKey,
  bundlesById,
  progress,
}: BuildSeasonViewInput): SeasonItemEntry[] {
  // Determine which items should appear for this season.
  // Specific seasons include both that season's items and items
  // available in any season.
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

    // Build the list of bundle usages for this item so the Seasonal
    // view can show where the item is needed and whether it is complete.
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

  // Sort items alphabetically for stable display in the Seasonal view.
  return result.sort((a, b) => a.item.name.localeCompare(b.item.name))
}
