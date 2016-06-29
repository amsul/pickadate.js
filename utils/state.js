const SCOPE  = require('constants/scope')

let dateUtil = require('utils/date')



////////////
// UPDATE //
////////////



/**
 * Updates the state with certain changes by passing it through
 * a series of middleware that compute the final state.
 * @param  {Function[]} middlewares
 * @param  {Object} state
 * @param  {Object} changedState
 * @return {Object}
 */
function update(middlewares, state, changedState) {

  let nextState = {
    ...state,
    ...changedState,
  }

  middlewares.forEach(middleware => {
    // TODO: Add return value validation.
    nextState = middleware(state, nextState)
  })

  return nextState

}





//////////////
// CHECKERS //
//////////////



/**
 * Checks if the value of certain state properties are changing.
 * @param  {Object}    state
 * @param  {Object}    nextState
 * @param  {...String} stateKeys A list of the property keys to compare
 * @return {Boolean}
 */
function isChanging(state, nextState, ...stateKeys) {
  return stateKeys.every(stateKey => state[stateKey] !== nextState[stateKeys])
}



function isChangingAny(state, nextState, ...stateKeys) {
  return stateKeys.some(stateKey => state[stateKey] !== nextState[stateKeys])
}



/**
 * Checks if the value of certain state properties are not changing.
 * @param  {Object}    state
 * @param  {Object}    nextState
 * @param  {...String} stateKeys A list of the property keys to compare
 * @return {Boolean}
 */
function isNotChanging(state, nextState, ...stateKeys) {
  return !isChanging(state, nextState, ...stateKeys)
}



/**
 * Checks if a certain date object is the same as the "selected" one.
 * @param  {Object}  state
 * @param  {Date}  dateObject
 * @return {Boolean}
 */
function isSelected(state, dateObject) {

  let { scope, selected } = state

  let checker = (
    scope === SCOPE.YEARS ? dateUtil.isSameYear :
    scope === SCOPE.MONTHS ? dateUtil.isSameMonth :
    dateUtil.isSameDate
  )

  return checker(selected, dateObject)

}



/**
 * Checks if a certain date object is the same as "today".
 * @param  {Object}  state
 * @param  {Date}  dateObject
 * @return {Boolean}
 */
function isToday(state, dateObject) {

  let { scope, today } = state

  if (scope !== SCOPE.DAYS) {
    return false
  }

  return dateUtil.isSameDate(today, dateObject)

}





/////////////
// EXPORTS //
/////////////



module.exports = {

  // Update
  update,

  // Checkers
  isChanging,
  isChangingAny,
  isNotChanging,
  isSelected,
  isToday,

}