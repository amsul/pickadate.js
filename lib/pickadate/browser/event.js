// @flow

export const EVENT_NAME = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  CHANGE: 'change',

  GRID: {
    REMOTE_ACTIVE: 'grid.remote-active',
    REMOTE_INACTIVE: 'grid.remote-inactive',
  },
}

export type EventName =
  | 'active'
  | 'inactive'
  | 'change'
  | 'grid.remote-active'
  | 'grid.remote-inactive'
