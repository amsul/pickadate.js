// @flow

import type { DatePickerActor } from 'pickadate/types'

type GetNextMinutes = (minutes: number, interval: number) => number

const createCycleMinuteActor = (
  getNextMinutes: GetNextMinutes
): DatePickerActor<> =>
  function cycleMinuteActor(state) {
    let { selected } = state
    if (!selected) {
      throw new Error('Cannot cycle the minute without a selected date')
    }

    const minutes = getNextMinutes(selected.getMinutes(), 15)
    selected = new Date(selected)
    selected.setMinutes(minutes)
    return { selected }
  }

export default createCycleMinuteActor
