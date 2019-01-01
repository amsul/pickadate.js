// @flow

import type { DatePickerActor } from '../types'

const cycleHourDownActor: DatePickerActor<> = state => {
  let { selected } = state
  if (!selected) {
    throw new Error('Cannot cycle the hour without a selected date')
  }

  let hoursInMeridiem = selected.getHours() % 12
  hoursInMeridiem = hoursInMeridiem === 0 ? 11 : hoursInMeridiem - 1

  const isPostMeridiem = selected.getHours() > 11
  if (isPostMeridiem) {
    hoursInMeridiem += 12
  }

  selected = new Date(selected)
  selected.setHours(hoursInMeridiem)
  return { selected }
}

export default cycleHourDownActor
