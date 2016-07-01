const STATE = require('constants/state')

let logUtil = require('utils/log')



/**
 * A mapping of reducers to the state key they reduce upon,
 * mapping to reducers by action type.
 * @private
 * @type {Object<Object(Function)>}
 */
const KEY_TYPE_REDUCERS = STATE.KEYS.reduce(
  (KEY_TYPE_REDUCERS, key) => {
    KEY_TYPE_REDUCERS[key] = require(`reducers/${key}`)
    return KEY_TYPE_REDUCERS
  },
  {}
)



/**
 * Reduces a state by an action.
 * @param  {Object} state
 * @param  {Object} action
 *         {ACTION.TYPE} action.type
 *         {Object} [action.payload]
 * @return {Object}
 */
function reduce(state, { type, payload }) {

  if (process.env.DEBUG) {
    console.group('Action dispatched: %o', type)
    logUtil.payload(payload)
  }

  // Start off with the state not being changed
  let hasChanged = false

  // Create an empty next state
  let nextState  = {}

  // Go through all the state keys
  STATE.KEYS.forEach(key => {

    // Grab the reducer for the state key and action type
    let reducer = KEY_TYPE_REDUCERS[key][type]

    // If there's no reducer, update the next state with the current state
    if (!reducer) {
      nextState[key] = state[key]
      return
    }

    // Grab the previous state for the key and default `null` values
    // to `undefined` so default params can kick in
    let previousStateForKey = state[key] == null ? undefined : state[key]

    // Reduce the state with the action payload to get the next state
    let nextStateForKey = reducer(previousStateForKey, payload)

    // Update the key in the next state
    nextState[key] = nextStateForKey

    // If the state changed once or has now changed, mark it as such
    hasChanged = hasChanged || nextStateForKey !== previousStateForKey

  })

  if (process.env.DEBUG) {
    logUtil.diff(state, nextState)
    console.groupEnd()
  }

  // If the state hasn't changed, return the original state
  return hasChanged ? nextState : state

}



module.exports = {
  reduce,
}