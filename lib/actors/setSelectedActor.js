// @flow

import type { DatepickerActor, SetSelectedPayload } from '../types'

const setSelectedActor: DatepickerActor<SetSelectedPayload> = (
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
