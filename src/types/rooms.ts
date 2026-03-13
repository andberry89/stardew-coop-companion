// All Community Center room identifiers.
export type RoomId =
  | 'pantry'
  | 'crafts-room'
  | 'fish-tank'
  | 'boiler-room'
  | 'bulletin-board'
  | 'vault'

// Catalog metadata describing a Community Center room.
export type Room = {
  id: RoomId
  name: string
  sortOrder: number
  imgBefore: string
  imgAfter: string
  reward: string
}
