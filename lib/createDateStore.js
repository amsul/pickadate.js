// @flow

import type {
  DatepickerState,
  DatepickerAction,
  SetSelectedPayload,
} from './types'

import createStore from './createStore'
import setSelectedActor from './actors/setSelectedActor'

export default function createDateStore() {
  const initialState = {
    selected: null,
  }
  const store = createStore<DatepickerState>(initialState)
  return {
    getState: store.getState,
    setSelected: (store.addActor(
      setSelectedActor
    ): DatepickerAction<SetSelectedPayload>),
  }
}
