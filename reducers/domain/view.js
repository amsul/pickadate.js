const ACTION       = require('constants/action')
const calendarUtil = require('utils/calendar')
const dateUtil     = require('utils/date')



/**
 * Initializes the view's date using the selected date, defaulting to today.
 * @param  {Object} state
 * @return {Object}
 */
function initialize(state) {
  return {
    ...state,
    view: calendarUtil.getStartDateOfMonth(
      state.selected || new Date()
    )
  }
}



/**
 * Updates the view's date when the selected date changes.
 * @param  {Object} state
 * @return {Object}
 */
function updateUsingSelected(state) {

  // If there is no selected date
  // or selected date is is in the same month as the view's date,
  // return the original state
  if (
    !state.selected
    ||
    dateUtil.isSameMonth(state.view, state.selected)
  ) {
    return state
  }

  return {
    ...state,
    view: calendarUtil.getStartDateOfMonth(state.selected)
  }

}



module.exports = {
  [ACTION.TYPE.INITIALIZE]       : initialize,
  [ACTION.TYPE.SELECT]           : updateUsingSelected,
  [ACTION.TYPE.SELECT_IN_PERIOD] : updateUsingSelected,
}
