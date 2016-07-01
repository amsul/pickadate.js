const SCOPE  = require('constants/scope')

let dateUtil = require('utils/date')



/////////////////////
// CHANGE CHECKERS //
/////////////////////



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





////////////////////
// STATE CHECKERS //
////////////////////



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

  // Change checkers
  isChanging,
  isChangingAny,
  isNotChanging,

  // State checkers
  isSelected,
  isToday,

}