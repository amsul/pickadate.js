// @flow

import type { DatePickerActor, SetFirstDayOfWeekPayload } from 'pickadate/types'

const setFirstDayOfWeekActor: DatePickerActor<SetFirstDayOfWeekPayload> = (
  state,
  payload
) => {
  if (
    typeof payload.value === 'number' &&
    payload.value >= 0 &&
    payload.value <= 6
  ) {
    return {
      firstDayOfWeek: payload.value,
    }
  }
}

export default setFirstDayOfWeekActor
