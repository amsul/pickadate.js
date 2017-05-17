const SCOPE    = require('constants/scope')
const dateUtil = require('utils/date')



/**
 * Creates the date to use to set the next selected value.
 * @param  {Any} state
 * @param  {SCOPE} payload.scope
 * @param  {Date|null} payload.selected
 * @param  {Date|Number} payload.value
 * @return {Date}
 */
function createDateToSet(state, { scope, selected, value }) {

  const isScopeDays = scope === SCOPE.DAYS

  // If there's nothing currently selected,
  // and the scope is not DAYS,
  // return the current state
  if (!selected && !isScopeDays) {
    return state
  }

  // Create a date from the value
  value = dateUtil.create(value)

  // If nothing was selected, return the new value
  if (!selected) {
    return value
  }

  // If the date is the same as the currently selected date,
  // return the current state
  if (dateUtil.isSameDate(selected, value)) {
    return state
  }

  // If the scope is DAYS, return the new value
  if (isScopeDays) {
    return value
  }

  // Otherwise, create a date in the year and month of the value
  // and the date of the currently selected date
  return dateUtil.createInMonth(
    value.getFullYear(),
    value.getMonth(),
    selected.getDate()
  )

}



module.exports = {
  createDateToSet,
}
