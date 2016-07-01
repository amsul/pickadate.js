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
 * Cycles through the scopes.
 * @param  {SCOPE} state
 * @return {SCOPE}
 */
function cycleScope(state) {
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
  [ACTION.TYPE.CYCLE_SCOPE] : cycleScope,
  [ACTION.TYPE.INITIALIZE]  : initialize,
  [ACTION.TYPE.SELECT]      : showDeeperScope,
}