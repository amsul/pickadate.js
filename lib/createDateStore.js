// @flow

import type { DatePickerStore, DatePickerState } from './types'

import * as calendarUtil from './utils/calendarUtil'
import createStore from './createStore'
import setSelectedActor from './actors/setSelectedActor'
import setMinimumActor from './actors/setMinimumActor'
import setMaximumActor from './actors/setMaximumActor'
import setFirstDayOfWeekActor from './actors/setFirstDayOfWeekActor'
import clearActor from './actors/clearActor'
import viewPreviousActor from './actors/viewPreviousActor'
import viewNextActor from './actors/viewNextActor'
import viewTodayActor from './actors/viewTodayActor'

export default function createDateStore(): DatePickerStore {
  const initialState: DatePickerState = {
    firstDayOfWeek: 0,
    selected: null,
    view: calendarUtil.getStartDateOfMonth(new Date()),
    minimum: null,
    maximum: null,
  }
  const store = createStore(initialState)
  return {
    ...store,
    setFirstDayOfWeek: store.addActor(setFirstDayOfWeekActor),
    setSelected: store.addActor(setSelectedActor),
    setMinimum: store.addActor(setMinimumActor),
    setMaximum: store.addActor(setMaximumActor),
    clear: store.addActor(clearActor),
    viewPrevious: store.addActor(viewPreviousActor),
    viewNext: store.addActor(viewNextActor),
    viewToday: store.addActor(viewTodayActor),
  }
}
