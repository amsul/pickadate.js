// @flow

import type { DatePickerActor, SetViewPayload } from 'pickadate/types'
import * as calendarUtil from 'pickadate/utils/calendarUtil'
import * as actorUtil from 'pickadate/utils/actorUtil'

const setViewActor: DatePickerActor<SetViewPayload> = (state, payload) => {
  if (payload.value instanceof Date) {
    return {
      highlighted: actorUtil.getHighlighted(state.selected, payload.value),
      view: calendarUtil.getStartDateOfMonth(payload.value),
    }
  }
}

export default setViewActor
