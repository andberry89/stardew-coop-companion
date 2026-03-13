// Available tracker view modes.
export type ViewStatus = 'bundle' | 'season' | 'room'

// UI option used when switching between tracker views.
export type ViewOption = {
  key: ViewStatus
  label: string
}
