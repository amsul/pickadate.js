const ACTION     = require('constants/action')

let calendarUtil = require('utils/calendar')
let dateUtil     = require('utils/date')



/**
 * Initializes the view's date, defaulting to today.
 * @param  {Date} [state=new Date()]
 * @param  {LANGUAGE} payload.language
 * @param  {String} payload.template
 * @param  {String} payload.value
 * @return {Date}
 */
function initialize(state = new Date(), { language, template, value }) {

  // If there is a string value, parse it
  if (value && typeof value === 'string') {
    value = dateUtil.parse(value, template, language)
  }

  // Create the start date of the month from the value or state
  return calendarUtil.getStartDateOfMonth(value || state)

}



/**
 * Updates a view when the selection changes.
 * @param  {Object} state
 * @param  {LANGUAGE} payload.language
 * @param  {String} payload.template
 * @param  {Date|Number|String} payload.value
 * @return {Date}
 */
function update(state, { language, template, value }) {

  // If there is no value, return the original state
  if (!value) {
    return state
  }

  // If the value is a string, parse it
  if (typeof value === 'string') {
    value = dateUtil.parse(value, template, language)
  }

  // If the value is in the same month as the original state,
  // return the original state
  if (dateUtil.isSameMonth(state, value)) {
    return state
  }

  // Create the start date of the month from the value
  return calendarUtil.getStartDateOfMonth(value)

}



module.exports = {
  [ACTION.TYPE.INITIALIZE] : initialize,
  [ACTION.TYPE.SELECT]     : update,
  [ACTION.TYPE.SHOW]       : update,
}