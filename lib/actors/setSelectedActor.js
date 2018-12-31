// @flow

import type { DatePickerActor, SetSelectedPayload } from '../types'
import * as calendarUtil from '../utils/calendarUtil'
import * as dateUtil from '../utils/dateUtil'

const setSelectedActor: DatePickerActor<SetSelectedPayload> = (
  state,
  payload
) => {
  const selected = getNextSelected(state, payload)
  const view = getNextView(state, payload, selected)
  if (!selected) {
    return
  }
  return {
    selected,
    view,
  }
}

const getNextSelected = (state, payload) => {
  if (payload.value instanceof Date) {
    return payload.value
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
