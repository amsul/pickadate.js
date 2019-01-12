// @flow

import type { DatePickerActor, SetSelectedPayload } from 'pickadate/types'
import * as calendarUtil from 'pickadate/utils/calendarUtil'
import * as dateUtil from 'pickadate/utils/dateUtil'
import * as timeUtil from 'pickadate/utils/timeUtil'
import * as actorUtil from 'pickadate/utils/actorUtil'
import * as dateSelector from 'pickadate/selectors/dateSelector'

const setSelectedActor: DatePickerActor<SetSelectedPayload> = (
  state,
  payload
) => {
  const selected = getNextSelected(state, payload)
  if (!selected || dateSelector.isDisabled(state, selected)) {
    return
  }

  if (state.selected) {
    const time = timeUtil.getFromDate(state.selected)
    selected.setHours(time.hours, time.minutes)
  }

  const view = getNextView(state, payload, selected)
  return {
    selected,
    highlighted: getNextHighlighted(state, payload, selected, view),
    view,
  }
}

const getNextSelected = (state, payload) => {
  if (payload.value instanceof Date) {
    return new Date(payload.value)
  }
  if (Number.isInteger(payload.value)) {
    return new Date(payload.value)
  }
}

const getNextView = (state, payload, nextSelected) => {
  if (
    payload.isUpdatingView === false ||
    dateUtil.isSameMonth(state.view, nextSelected)
  ) {
    return
  }
  return calendarUtil.getStartDateOfMonth(nextSelected)
}

const getNextHighlighted = (state, payload, nextSelected, nextView) => {
  if (payload.isUpdatingView === false) {
    return
  }
  return actorUtil.getHighlighted(nextSelected, nextView || state.view)
}

export default setSelectedActor
