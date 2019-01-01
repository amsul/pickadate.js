// @flow

import type { DatePickerActor } from '../types'

const toggleMeridiemActor: DatePickerActor<> = state => {
  let { selected } = state
  if (!selected) {
    return
  }

  let hours = selected.getHours()
  hours += hours <= 11 ? 12 : -12

  selected = new Date(selected)
  selected.setHours(hours)
  return { selected }
}

export default toggleMeridiemActor
