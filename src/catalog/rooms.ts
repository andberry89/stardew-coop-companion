import type { Room } from '@/types/rooms'

export const rooms: Room[] = [
  {
    id: 'crafts-room',
    name: 'Crafts Room',
    sortOrder: 1,
    reward: 'Bridge Repair',
    imgBefore: 'crafts-room-before.png',
    imgAfter: 'crafts-room-after.png',
  },
  {
    id: 'pantry',
    name: 'Pantry',
    sortOrder: 2,
    reward: 'Greenhouse',
    imgBefore: 'pantry-before.png',
    imgAfter: 'pantry-after.png',
  },
  {
    id: 'fish-tank',
    name: 'Fish Tank',
    sortOrder: 3,
    reward: 'Glittering Boulder Removed',
    imgBefore: 'fish-tank-before.png',
    imgAfter: 'fish-tank-after.png',
  },
  {
    id: 'boiler-room',
    name: 'Boiler Room',
    sortOrder: 4,
    reward: 'Minecarts Repaired',
    imgBefore: 'boiler-room-before.png',
    imgAfter: 'boiler-room-after.png',
  },
  {
    id: 'bulletin-board',
    name: 'Bulletin Board',
    sortOrder: 5,
    reward: 'Friendship',
    imgBefore: 'bulletin-board-before.png',
    imgAfter: 'bulletin-board-after.png',
  },
  {
    id: 'vault',
    name: 'Vault',
    sortOrder: 6,
    reward: 'Bus Repair',
    imgBefore: 'vault-before.png',
    imgAfter: 'vault-after.png',
  },
  // ...
]
