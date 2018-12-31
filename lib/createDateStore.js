// @flow

import type { DatePickerStore } from './types'

import createStore from './createStore'
import setSelectedActor from './actors/setSelectedActor'
import clearActor from './actors/clearActor'

export default function createDateStore(): DatePickerStore {
  const initialState = {
    selected: null,
  }
  const store = createStore(initialState)
  return {
    ...store,
    setSelected: store.addActor(setSelectedActor),
    clear: store.addActor(clearActor),
  }
}
