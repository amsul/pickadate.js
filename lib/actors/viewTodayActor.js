// @flow

import type { DatePickerActor } from '../types'
import * as calendarUtil from '../utils/calendarUtil'
import * as actorUtil from '../utils/actorUtil'

const viewTodayActor: DatePickerActor<> = (state, payload) => {
  const view = calendarUtil.getStartDateOfMonth(new Date())
  return {
    highlighted: actorUtil.getHighlighted(state.selected, view),
    view,
  }
}

export default viewTodayActor
