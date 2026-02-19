import type { Item } from '@/types'

export const items: Item[] = [
  {
    id: 'wood',
    name: 'Wood',
    type: 'resource',
    seasons: ['any'],
    sources: ['Chopping trees'],
  },
  {
    id: 'stone',
    name: 'Stone',
    type: 'resource',
    seasons: ['any'],
    sources: ['Mining rocks'],
  },
  {
    id: 'hardwood',
    name: 'Hardwood',
    type: 'resource',
    seasons: ['any'],
    sources: ['Chopping large stumps with upgraded axe', 'Crates in the mines'],
  },
  {
    id: 'copper-bar',
    name: 'Copper Bar',
    type: 'resource',
    seasons: ['any'],
    sources: ['Smelting Copper Ore in the Furnace'],
  },
  {
    id: 'iron-bar',
    name: 'Iron Bar',
    type: 'resource',
    seasons: ['any'],
    sources: ['Smelting Iron Ore in the Furnace'],
  },
  {
    id: 'gold-bar',
    name: 'Gold Bar',
    type: 'resource',
    seasons: ['any'],
    sources: ['Smelting Gold Ore in the Furnace'],
  },
  {
    id: 'solar-essence',
    name: 'Solar Essence',
    type: 'resource',
    seasons: ['any'],
    sources: [
      'Drop from Ghosts and Squid Kids in the Mines',
      'Fish Pond product from Sunfish',
      'Sold by Krobus',
    ],
  },
  {
    id: 'void-essence',
    name: 'Void Essence',
    type: 'resource',
    seasons: ['any'],
    sources: [
      'Drop from Shadow Brutes in the Mines',
      'Fish Pond product from Void Salmon',
      'Sold by Krobus',
    ],
  },
]
