import type { Season, ItemType, RoomStatus, NullableFilterOption } from '@/types'

export const SEASON_FILTERS: NullableFilterOption<Season>[] = [
  { key: null, label: 'All', icon: '/images/seasons/all-seasons.png' },
  { key: 'spring', label: 'Spring', icon: '/images/seasons/spring.png' },
  { key: 'summer', label: 'Summer', icon: '/images/seasons/summer.png' },
  { key: 'fall', label: 'Fall', icon: '/images/seasons/fall.png' },
  { key: 'winter', label: 'Winter', icon: '/images/seasons/winter.png' },
]

export const TYPE_FILTERS: NullableFilterOption<ItemType>[] = [
  { key: null, label: 'All Types', icon: '/images/seasons/types/inventory.png' },
  { key: 'crop', label: 'Crop', icon: '/images/seasons/types/farming-skill.png' },
  { key: 'forage', label: 'Forage', icon: '/images/seasons/types/foraging-skill.png' },
  { key: 'fish', label: 'Fish', icon: '/images/seasons/types/midnight-carp.png' },
  { key: 'artisan', label: 'Artisan', icon: '/images/seasons/types/mead.png' },
  { key: 'animal', label: 'Animal', icon: '/images/seasons/types/blue-chicken.png' },
  { key: 'mining', label: 'Mining', icon: '/images/seasons/types/mining-skill.png' },
  { key: 'resource', label: 'Resource', icon: '/images/seasons/types/alamite.png' },
]

export const ROOM_FILTERS: NullableFilterOption<RoomStatus>[] = [
  { key: null, label: 'All Rooms' },
  { key: 'complete', label: 'Completed' },
  { key: 'incomplete', label: 'Incomplete' },
]
