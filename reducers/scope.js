const ACTION = require('constants/action')
const SCOPE  = require('constants/scope')
const STATE  = require('constants/state')



/**
 * Initializes the scope, defaulting to DAYS.
 * @param  {SCOPE} [state=STATE.INITIAL.scope]
 * @return {SCOPE}
 */
function initialize(state = STATE.INITIAL.scope) {
  return state
}



/**
 * Toggles the scope to the next one in the queue.
 * @param  {SCOPE} state
 * @return {SCOPE}
 */
function toggleScope(state) {
  return (
    state === SCOPE.DAYS ? SCOPE.MONTHS :
    state === SCOPE.MONTHS ? SCOPE.YEARS :
    SCOPE.DAYS
  )
}



/**
 * Shows the next deeper scope, stopping at the deepest: DAYS.
 * @param  {SCOPE} state
 * @return {SCOPE}
 */
function showDeeperScope(state) {
  return state === SCOPE.YEARS ? SCOPE.MONTHS : SCOPE.DAYS
}



module.exports = {
  [ACTION.TYPE.INITIALIZE]   : initialize,
  [ACTION.TYPE.SELECT]       : showDeeperScope,
  [ACTION.TYPE.TOGGLE_SCOPE] : toggleScope,
}