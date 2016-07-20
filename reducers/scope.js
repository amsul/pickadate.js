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
 * Selects the next deeper scope if there is a value being selected.
 * @param  {SCOPE} state
 * @return {SCOPE}
 */
function selectScope(state, { value }) {

  // If the value is being cleared, do not change the scope
  if (!value) {
    return state
  }

  // Otherwise move on to the next deeper scope
  return state === SCOPE.YEARS ? SCOPE.MONTHS : SCOPE.DAYS

}



module.exports = {
  [ACTION.TYPE.CYCLE_SCOPE] : cycleScope,
  [ACTION.TYPE.INITIALIZE]  : initialize,
  [ACTION.TYPE.SELECT]      : selectScope,
}