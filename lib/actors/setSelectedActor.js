// @flow

import type { DatePickerActor, SetSelectedPayload } from '../types'
import * as calendarUtil from '../utils/calendarUtil'
import * as dateUtil from '../utils/dateUtil'
import * as timeUtil from '../utils/timeUtil'

const setSelectedActor: DatePickerActor<SetSelectedPayload> = (
  state,
  payload
) => {
  const selected = getNextSelected(state, payload)
  if (!selected) {
    return
  }

  if (state.selected) {
    const time = timeUtil.getFromDate(state.selected)
    selected.setHours(time.hours, time.minutes)
  }

  return {
    selected,
    view: getNextView(state, payload, selected),
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
    !nextSelected ||
    dateUtil.isSameMonth(state.view, nextSelected)
  ) {
    return state.view
  }
  return calendarUtil.getStartDateOfMonth(nextSelected)
}

export default setSelectedActor
