// @flow

import type { DatePickerActor, SetMaximumPayload } from '../types'

const setMaximumActor: DatePickerActor<SetMaximumPayload> = (
  state,
  payload
) => {
  if (payload.value instanceof Date) {
    return {
      minimum: payload.value,
    }
  }
}

export default setMaximumActor
