const ACTION      = require('constants/action')
const STATE       = require('constants/state')
const rootReducer = require('reducers/root')
const logUtil     = require('utils/log')



/**
 * Gets the next state by passing a state through reducers
 * with a certain action.
 * @private
 * @param  {Object} state
 * @param  {Object} action
 * @param  {Function} [reducer]
 * @return {Object}
 */
function getNext(state, action, reducer) {

  /* istanbul ignore if */
  if (process.env.DEBUG) {
    console.group('Action dispatched: %o', action.type)
    console.assert(action.type, 'An undefined action was dispatched')
    logUtil.payload(action.payload)
  }

  const previousState = state
  state = rootReducer(state, action)
  state = reducer ? reducer(state, action) : state

  /* istanbul ignore if */
  if (process.env.DEBUG) {
    logUtil.diff(previousState, state)
    console.groupEnd()
  }

  return state

}



/**
 * Gets the initial state with certain changes applied.
 * @private
 * @param  {Object} [payload={}]
 * @param  {Function} [reducer]
 * @return {Object}
 */
function getInitial(payload = {}, reducer) {

  const action = {
    payload,
    type: ACTION.TYPE.INITIALIZE,
  }

  return getNext(STATE.INITIAL, action, reducer)

}



module.exports = {
  getInitial,
  getNext,
}
