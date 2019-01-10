// @flow

jest.mock('raf')
import raf from 'raf'

let animationFrameId = 7
const mockRaf = () => animationFrameId
mockRaf.cancel = jest.fn()
raf.mockImplementation(mockRaf)

import createStore from 'pickadate/createStore'

describe('createStore()', () => {
  const initialState = {
    nice: true,
    wow: 'hello',
  }

  let store = {}
  beforeEach(() => {
    store = createStore(initialState)
    animationFrameId = 7
  })

  it('creates a store with an initial state', async () => {
    const apiKeys = Object.keys(store)
    expect(apiKeys).toEqual(['addActor', 'subscribe', 'getState'])
  })

  describe('getState()', () => {
    it('gets the state of the store', () => {
      const state = store.getState()
      expect(state).toBe(initialState)
    })
  })

  describe('addActor()', () => {
    it('adds an actor that returns a store action that updates the state', () => {
      const actor = (state, payload) => {
        if (payload.isUpdatingValue) {
          return {
            wow: 'beautiful',
          }
        }
      }
      const action = store.addActor(actor)

      action({})
      expect(store.getState()).toBe(initialState)

      action({ isUpdatingValue: true })
      expect(store.getState()).not.toBe(initialState)
      expect(store.getState()).toEqual({
        ...initialState,
        wow: 'beautiful',
      })
    })
  })

  describe('subscribe()', () => {
    const getLastAnimationFrameCallback = raf => {
      const lastCall = raf.mock.calls[raf.mock.calls.length - 1]
      expect(lastCall.length).toBe(1)
      return lastCall[0]
    }

    afterEach(() => {
      raf.mockReset()
    })

    it('adds a listener that is invoked on an animation frame whenever the state updates', () => {
      const actor = state => ({ nice: !state.nice })
      const action = store.addActor(actor)

      const listener = jest.fn()
      const unsubscribe = store.subscribe(listener)

      // Initially nothing is called
      expect(listener).toHaveBeenCalledTimes(0)
      expect(raf).toHaveBeenCalledTimes(0)
      expect(raf.cancel).toHaveBeenCalledTimes(0)

      // When an action is called, an animation frame is awaited
      action()
      expect(listener).toHaveBeenCalledTimes(0)
      expect(raf).toHaveBeenCalledTimes(1)
      expect(raf.cancel).toHaveBeenCalledTimes(0)

      // When an action is called, a new animation frame is awaited
      action()
      expect(listener).toHaveBeenCalledTimes(0)
      expect(raf).toHaveBeenCalledTimes(2)
      expect(raf.cancel).toHaveBeenCalledTimes(1)
      expect(raf.cancel).toHaveBeenCalledWith(animationFrameId)

      // When the last animation frame callback is trigged, the listener is triggered
      getLastAnimationFrameCallback(raf)()
      expect(listener).toHaveBeenCalledTimes(1)
      expect(raf).toHaveBeenCalledTimes(2)
      expect(raf.cancel).toHaveBeenCalledTimes(1)

      // When unsubscribe is called, the listener is unsubscribed
      unsubscribe()
      action()
      expect(listener).toHaveBeenCalledTimes(1)
      expect(raf).toHaveBeenCalledTimes(3)
      expect(raf.cancel).toHaveBeenCalledTimes(2)
      getLastAnimationFrameCallback(raf)()
      expect(listener).toHaveBeenCalledTimes(1)
      expect(raf).toHaveBeenCalledTimes(3)
      expect(raf.cancel).toHaveBeenCalledTimes(2)
    })

    it('adds a listener that is not invoked whenever the state does not update', () => {
      const actor = state => {}
      const action = store.addActor(actor)

      const listener = jest.fn()
      store.subscribe(listener)

      // When action is triggered that doesn't update the state,
      // the animation frame isn't awaited and the listener isn't triggered
      action()
      expect(listener).toHaveBeenCalledTimes(0)
      expect(raf).toHaveBeenCalledTimes(0)
      expect(raf.cancel).toHaveBeenCalledTimes(0)
    })
  })
})
