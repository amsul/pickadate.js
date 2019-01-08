// @flow

import type { DatePickerActor } from 'pickadate/types'

const cycleMeridiemActor: DatePickerActor<> = state => {
  let { selected } = state
  if (!selected) {
    throw new Error('Cannot cycle the meridiem without a selected date')
  }

  let hours = selected.getHours()
  hours += hours <= 11 ? 12 : -12

  selected = new Date(selected)
  selected.setHours(hours)
  return { selected }
}

export default cycleMeridiemActor
