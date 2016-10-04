const SCOPE  = require('constants/scope')

let dateUtil = require('utils/date')
let jsUtil   = require('utils/js')



/////////////////////
// CHANGE CHECKERS //
/////////////////////



/**
 * Checks if any of the values of certain state properties have changed.
 * @param  {Object}    previousState
 * @param  {Object}    state
 * @param  {...String} stateKeys A list of the property keys to compare
 * @return {Boolean}
 */
function hasAnyChanged(previousState, state, ...stateKeys) {
  return stateKeys.some(stateKey => previousState[stateKey] !== state[stateKey])
}





////////////////////
// STATE CHECKERS //
////////////////////



/**
 * Checks if a certain date object is disabled.
 * @param  {Object}  state
 * @param  {Date}  dateObject
 * @return {Boolean}
 */
function isDisabled(state, dateObject) {

  let { disabled } = state

  if (
    jsUtil.isIncluded(
      disabled.exceptions,
      dateObject,
      dateUtil.isSameDate
    )
  ) {
    return false
  }

  return (
    jsUtil.isIncluded(disabled.days, dateObject.getDay())
    ||
    jsUtil.isIncluded(disabled.dates, dateObject, dateUtil.isSameDate)
  )

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

  // Change checkers
  hasAnyChanged,

  // State checkers
  isDisabled,
  isSelected,
  isToday,

}