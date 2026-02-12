export type RoomId =
  | 'pantry'
  | 'crafts-room'
  | 'fish-tank'
  | 'boiler-room'
  | 'bulletin-board'
  | 'vault'

export type Room = {
  id: RoomId
  name: string
  sortOrder: number
  imgBefore: string
  imgAfter: string
  reward: string
}
