// @flow

import type { DatePickerActor } from '../types'
import * as calendarUtil from '../utils/calendarUtil'

const viewTodayActor: DatePickerActor<> = (state, payload) => {
  return {
    view: calendarUtil.getStartDateOfMonth(new Date()),
  }
}

export default viewTodayActor
