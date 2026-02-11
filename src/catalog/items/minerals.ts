import type { Item } from '@/types/bundles'

export const items: Item[] = [
  {
    id: 'quartz',
    name: 'Quartz',
    type: 'mineral',
    seasons: ['any'],
    sources: ['Mines (all floors)'],
  },
  {
    id: 'earth-crystal',
    name: 'Earth Crystal',
    type: 'mineral',
    seasons: ['any'],
    sources: ['Mines (1-39)', 'Geodes, Omni Geodes'],
  },
  {
    id: 'frozen-tear',
    name: 'Frozen Tear',
    type: 'mineral',
    seasons: ['any'],
    sources: ['Mines (40-79)', 'Frozen Geodes, Omni Geodes', 'Drop from Dust Sprites'],
  },
  {
    id: 'fire-quartz',
    name: 'Fire Quartz',
    type: 'mineral',
    seasons: ['any'],
    sources: ['Mines (80-120)', 'Magma Geodes, Omni Geodes'],
  },
  {
    id: 'aquamarine',
    name: 'Aquamarine',
    type: 'mineral',
    seasons: ['any'],
    sources: ['Aquamarine nodes and boxes in the Mines', 'Fishing Treasure Chests'],
  },
  {
    id: 'frozen-geode',
    name: 'Frozen Geode',
    type: 'mineral',
    seasons: ['any'],
    sources: ['Mines (40-79)'],
  },
]
