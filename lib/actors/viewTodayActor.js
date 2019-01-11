// @flow

import type { DatePickerActor } from 'pickadate/types'
import * as calendarUtil from 'pickadate/utils/calendarUtil'
import * as actorUtil from 'pickadate/utils/actorUtil'

const viewTodayActor: DatePickerActor<> = state => {
  const view = calendarUtil.getStartDateOfMonth(new Date())
  return {
    highlighted: actorUtil.getHighlighted(state.selected, view),
    view,
  }
}

export default viewTodayActor
