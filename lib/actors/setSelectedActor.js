// @flow

import type { DatePickerActor, SetSelectedPayload } from '../types'

const setSelectedActor: DatePickerActor<SetSelectedPayload> = (
  state,
  payload
) => {
  if (payload.value instanceof Date) {
    return {
      selected: payload.value,
    }
  }
  if (Number.isInteger(payload.value)) {
    return {
      selected: new Date(payload.value),
    }
  }
}

export default setSelectedActor
