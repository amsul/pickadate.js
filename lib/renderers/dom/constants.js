// @flow

// prettier-ignore
export const EVENT_NAME = {
  CHANGE  : 'pickadate:change',
  MOUNT   : 'pickadate:mount',
  UNMOUNT : 'pickadate:unmount',

  INPUT_ACTIVE   : 'pickadate:input-active',
  INPUT_INACTIVE : 'pickadate:input-inactive',
  INPUT_OPEN     : 'pickadate:input-open',
  INPUT_CLOSE    : 'pickadate:input-close',
}

export type EventName = $Values<typeof EVENT_NAME>
