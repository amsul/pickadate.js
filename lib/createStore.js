// @flow

import type { Store } from './types'
import raf from 'raf'

export default function createStore(initialState: Object): Store<*> {
  let state = initialState

  function addActor(actor: Function) {
    return payload => {
      console.log('Updating state using %o: %o', actor.name, payload)
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
