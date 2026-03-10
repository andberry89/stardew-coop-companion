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

  return itemIds
    .map((itemId) => {
      const item = itemsById[itemId]
      if (!item) {
        return null
      }

      const entryKeys = entryKeysByItemId[itemId] ?? []

      const usages = entryKeys
        .map((entryKey) => {
          const entry = entriesByKey[entryKey]
          if (!entry) {
            return null
          }

          const bundle = bundlesById[entry.bundleId]

          return {
            entryKey,
            bundleId: entry.bundleId,
            bundleName: bundle?.name ?? entry.bundleId,
            completed:
              !!progress.entryCompletedById[entryKey as keyof typeof progress.entryCompletedById],
            requiredPerSubmission: entry.requiredPerSubmission ?? 1,
            minQuality: entry.minQuality,
          }
        })
        .filter(
          (
            usage,
          ): usage is {
            entryKey: string
            bundleId: string
            bundleName: string
            completed: boolean
            requiredPerSubmission: number
            minQuality?: string
          } => usage !== null,
        )

      return {
        item,
        inventory: progress.inventoryByItemId[itemId] ?? 0,
        usages,
      }
    })
    .filter((entry): entry is SeasonItemEntry => entry !== null)
    .sort((a, b) => a.item.name.localeCompare(b.item.name))
}
