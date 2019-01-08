// @flow

import type { DatePickerActor } from 'pickadate/types'

type GetNextHours = (hoursInMeridiem: number) => number

const createCycleHourActor = (getNextHours: GetNextHours): DatePickerActor<> =>
  function cycleHourActor(state) {
    let { selected } = state
    if (!selected) {
      throw new Error('Cannot cycle the hour without a selected date')
    }

    let hoursInMeridiem = getNextHours(selected.getHours() % 12)
    const isPostMeridiem = selected.getHours() > 11
    if (isPostMeridiem) {
      hoursInMeridiem += 12
    }

    selected = new Date(selected)
    selected.setHours(hoursInMeridiem)
    return { selected }
  }

export default createCycleHourActor
