// @flow

import type { DatePickerStore } from './types'

import createStore from './createStore'
import setSelectedActor from './actors/setSelectedActor'

export default function createDateStore(): DatePickerStore {
  const initialState = {
    selected: null,
  }
  const store = createStore(initialState)
  return {
    ...store,
    setSelected: store.addActor(setSelectedActor),
  }
}
