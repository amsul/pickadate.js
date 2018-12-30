// @flow

import raf from 'raf'

type StoreType<StateType> = {
  addActor: Function,
  subscribe: Function,
  getState: () => StateType,
}

export default function createStore<StateType>(
  initialState: StateType
): StoreType<StateType> {
  let state = initialState

  function addActor(actor: Function) {
    return payload => {
      const nextPartialState = actor(state, payload)
      const nextState = nextPartialState
        ? { ...state, ...nextPartialState }
        : state
      notify(nextState)
    }
  }

  let animationFrameId = null
  const listeners = []

  function notify(nextState) {
    state = nextState
    if (animationFrameId) {
      raf.cancel(animationFrameId)
    }
    animationFrameId = raf(() => listeners.forEach(listener => listener()))
  }

  function subscribe(listener: Function) {
    listeners.push(listener)
    return () => {
      const indexOfListener = listeners.indexOf(listener)
      if (indexOfListener > -1) {
        listeners.splice(indexOfListener, 1)
      }
    }
  }

  return {
    addActor,
    subscribe,
    getState: () => state,
  }
}
