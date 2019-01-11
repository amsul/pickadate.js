// @flow

import type { DatePickerActor, SetMaximumPayload } from 'pickadate/types'

const setMaximumActor: DatePickerActor<SetMaximumPayload> = (
  state,
  payload
) => {
  if (payload.value instanceof Date) {
    return {
      maximum: payload.value,
    }
  }
}

export default setMaximumActor
