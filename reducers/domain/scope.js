const ACTION = require('constants/action')
const SCOPE  = require('constants/scope')



/**
 * Sets the scope.
 * @param  {Object} state
 * @param  {Object} payload
 *         {SCOPE} payload.scope
 * @return {Object}
 */
function set(state, payload) {

  const { scope } = payload

  if (!scope || scope === state.scope) {
    return state
  }

  return { ...state, scope }

}



/**
 * Cycles through the scopes.
 * @param  {Object} state
 * @return {Object}
 */
function cycleScope(state) {

  const scope = (
    state.scope === SCOPE.DAYS ? SCOPE.MONTHS :
    state.scope === SCOPE.MONTHS ? SCOPE.YEARS :
    SCOPE.DAYS
  )

  return { ...state, scope }

}



/**
 * Zooms in the scope if a value is being selected.
 * @param  {Object} state
 * @param  {Date|Number|String|null} payload.value
 * @return {Object}
 */
function zoomInScope(state, { value }) {

  // If the value is being cleared, do not change the scope
  if (!value || state.scope === SCOPE.DAYS) {
    return state
  }

  // Otherwise move on to the next deeper scope
  const scope = state.scope === SCOPE.YEARS ? SCOPE.MONTHS : SCOPE.DAYS

  return { ...state, scope }

}



module.exports = {
  [ACTION.TYPE.CYCLE_SCOPE] : cycleScope,
  [ACTION.TYPE.INITIALIZE]  : set,
  [ACTION.TYPE.SELECT]      : zoomInScope,
}
