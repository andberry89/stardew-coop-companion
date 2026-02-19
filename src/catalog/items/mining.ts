import type { Item } from '@/types'

export const items: Item[] = [
  {
    id: 'quartz',
    name: 'Quartz',
    type: 'mining',
    seasons: ['any'],
    sources: ['Mines (all floors)'],
  },
  {
    id: 'earth-crystal',
    name: 'Earth Crystal',
    type: 'mining',
    seasons: ['any'],
    sources: ['Mines (1-39)', 'Geodes, Omni Geodes'],
  },
  {
    id: 'frozen-tear',
    name: 'Frozen Tear',
    type: 'mining',
    seasons: ['any'],
    sources: ['Mines (40-79)', 'Frozen Geodes, Omni Geodes', 'Drop from Dust Sprites'],
  },
  {
    id: 'fire-quartz',
    name: 'Fire Quartz',
    type: 'mining',
    seasons: ['any'],
    sources: ['Mines (80-120)', 'Magma Geodes, Omni Geodes'],
  },
  {
    id: 'aquamarine',
    name: 'Aquamarine',
    type: 'mining',
    seasons: ['any'],
    sources: ['Aquamarine nodes and boxes in the Mines', 'Fishing Treasure Chests'],
  },
]
