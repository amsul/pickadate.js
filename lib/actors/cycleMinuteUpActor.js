// @flow

import type { DatePickerActor } from '../types'

const cycleMinuteUpActor: DatePickerActor<> = state => {
  let { selected } = state
  if (!selected) {
    throw new Error('Cannot cycle the minute without a selected date')
  }

  let minutes = selected.getMinutes()
  minutes = minutes === 59 ? 0 : minutes + 1

  selected = new Date(selected)
  selected.setMinutes(minutes)
  return { selected }
}

export default cycleMinuteUpActor
