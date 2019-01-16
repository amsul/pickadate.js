// @flow

import type { DatePickerActor, SetDisabledPayload } from 'pickadate/types'

const setDisabledActor: DatePickerActor<SetDisabledPayload> = (
  state,
  payload
) => {
  if (!Array.isArray(payload.value)) {
    return
  }

  const disabled = payload.value.filter(value => {
    // Keep in disabled weekdays
    if (typeof value === 'number') {
      return value >= 0 && value <= 6
    }

    // Keep in disabled range of dates
    if (Array.isArray(value)) {
      return (
        value.length === 2 &&
        value[0] instanceof Date &&
        value[1] instanceof Date
      )
    }

    // Keep in disabled individual dates
    return value instanceof Date
  })
  return { disabled }
}

export default setDisabledActor
