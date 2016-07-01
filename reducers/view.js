const ACTION     = require('constants/action')

let calendarUtil = require('utils/calendar')
let dateUtil     = require('utils/date')



/**
 * Initializes the view's date, defaulting to today.
 * @param  {Date} [state=new Date()]
 * @return {Date}
 */
function initialize(state = new Date()) {
  return calendarUtil.getStartDateOfMonth(state)
}



/**
 * Shows the next view for a certain scope.
 * @param  {Object} state
 * @param  {SCOPE} payload.scope
 * @return {Date}
 */
function showNext(state, { scope }) {
  return calendarUtil.getDateOfNextScope(state, scope)
}



/**
 * Shows the previous view for a certain scope.
 * @param  {Object} state
 * @param  {SCOPE} payload.scope
 * @return {Date}
 */
function showPrevious(state, { scope }) {
  return calendarUtil.getDateOfPreviousScope(state, scope)
}



/**
 * Shows a specific view.
 * @param  {Object} state
 * @param  {Date} payload.view
 * @return {Date}
 */
function show(state, { view }) {
  return calendarUtil.getStartDateOfMonth(view)
}



/**
 * Updates a view when the selection changes.
 * @param  {Object} state
 * @param  {Date} payload.view
 * @return {Date}
 */
function update(state, { value }) {
  if (!value || dateUtil.isSameMonth(state, value)) {
    return state
  }
  return calendarUtil.getStartDateOfMonth(value)
}



module.exports = {
  [ACTION.TYPE.INITIALIZE]         : initialize,
  [ACTION.TYPE.SELECT]             : update,
  [ACTION.TYPE.SHOW_NEXT_VIEW]     : showNext,
  [ACTION.TYPE.SHOW_PREVIOUS_VIEW] : showPrevious,
  [ACTION.TYPE.SHOW_VIEW]          : show,
}