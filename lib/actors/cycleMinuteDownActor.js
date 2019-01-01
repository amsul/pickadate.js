// @flow

import type { DatePickerActor } from '../types'

const cycleMinuteDownActor: DatePickerActor<> = state => {
  let { selected } = state
  if (!selected) {
    throw new Error('Cannot cycle the minute without a selected date')
  }

  let minutes = selected.getMinutes()
  minutes = minutes === 0 ? 59 : minutes - 1

  selected = new Date(selected)
  selected.setMinutes(minutes)
  return { selected }
}

export default cycleMinuteDownActor
