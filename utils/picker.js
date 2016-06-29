const SCOPE        = require('constants/scope')

let coreMiddleware = require('middlewares/core')
let logMiddleware  = require('middlewares/log')
let animationUtil  = require('utils/animation')
let stateUtil      = require('utils/state')



///////////////////
// INITIAL STATE //
///////////////////



/**
 * The initial state of a picker.
 *
 * TODO: Add type validation and required state properties.
 *
 * @private
 * @type {Object}
 */
const INITIAL_STATE = {
  scope    : SCOPE.DAYS,
  selected : null,
  today    : null,
  view     : null,
}





////////////
// CREATE //
////////////



function create(startingState) {

  /**
   * The collection of middlewares to pipe state updates through.
   * @private
   * @type {Function[]}
   */
  let middlewares = [
    coreMiddleware.today,
    coreMiddleware.selected,
    coreMiddleware.view,
    coreMiddleware.scope,
    logMiddleware,
  ]

  /**
   * The collection of state listeners.
   * @private
   * @type {Function[]}
   */
  let stateListeners = []

  /**
   * The starting state merged with the initial state.
   * @type {Object}
   */
  let state = stateUtil.update(middlewares, INITIAL_STATE, startingState)

  /**
   * All changed state since the last time the listeners were triggered.
   * @private
   * @type {Object}
   */
  let changedState = null

  /**
   * The animation frame for updating the state.
   * @private
   * @type {Number}
   */
  let animationFrame = null

  /**
   * Triggers the state listeners.
   * @private
   * @param  {Object} nextState
   */
  let triggerStateListeners = (nextState) => {
    stateListeners.forEach(listener => listener(nextState))
  }

  /**
   * Adds a state listener.
   * @param  {Function} listener
   */
  let addStateListener = (listener) => {
    stateListeners.push(listener)
  }

  /**
   * Removes a state listener.
   * @param  {Function} listener
   */
  let removeStateListener = (listener) => {
    let indexOfListener = stateListeners.indexOf(listener)
    if (indexOfListener > -1) {
      stateListeners.splice(indexOfListener, 1)
    }
  }

  /**
   * Waits for the next animation frame and then sets
   * the state and triggers the listeners.
   * @param  {Object} nextChangedState
   */
  let setState = (nextChangedState) => {

    // Update the changed state with the next changed state.
    changedState = {
      ...changedState,
      ...nextChangedState,
    }

    // Get the next animation frame
    animationFrame = animationUtil.getFrame(animationFrame, () => {

      // Get the next state using the changed state.
      let nextState = stateUtil.update(middlewares, state, changedState)

      // Trigger the listeners with the next state.
      triggerStateListeners(nextState)

      // Update the state.
      state = nextState

      // Reset the changed state.
      changedState = null

    })

  }

  // Return the picker api.
  return {
    addStateListener,
    removeStateListener,
    setState,
    get state() {
      return state
    },
  }

}





/////////////
// EXPORTS //
/////////////



module.exports = {
  create,
}