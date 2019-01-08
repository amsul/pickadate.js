// @flow

import type { DatePickerActor, SetTimePayload } from 'pickadate/types'

const setTimeActor: DatePickerActor<SetTimePayload> = (state, payload) => {
  let { selected } = state
  if (!selected) {
    throw new Error('Cannot set the time without a selected date')
  }

  if (payload.hours != null && payload.hours !== selected.getHours()) {
    selected = new Date(selected)
    selected.setHours(payload.hours)
  }
  if (payload.minutes != null && payload.minutes !== selected.getMinutes()) {
    selected = new Date(selected)
    selected.setMinutes(payload.minutes)
  }

  if (selected !== state.selected) {
    return {
      selected,
    }
  }
}

export default setTimeActor
