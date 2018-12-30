// @flow

import type {
  Store,
  Action,
  DatePickerState,
  SetSelectedPayload,
} from './types'

import createStore from './createStore'
import setSelectedActor from './actors/setSelectedActor'

export default function createDateStore() {
  const initialState = {
    selected: null,
  }
  const store: Store<DatePickerState> = createStore(initialState)
  return {
    ...store,
    setSelected: (store.addActor(setSelectedActor): Action<SetSelectedPayload>),
  }
}
