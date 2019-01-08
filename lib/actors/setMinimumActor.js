// @flow

import type { DatePickerActor, SetMinimumPayload } from 'pickadate/types'

const setMinimumActor: DatePickerActor<SetMinimumPayload> = (
  state,
  payload
) => {
  if (payload.value instanceof Date) {
    return {
      minimum: payload.value,
    }
  }
}

export default setMinimumActor
