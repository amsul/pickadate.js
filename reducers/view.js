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

  if (value) {
    state = typeof value === 'string'
      ? dateUtil.parse(value, template, language)
      : value
  }

  return calendarUtil.getStartDateOfMonth(state)

}



/**
 * Updates a view when the selection changes.
 * @param  {Object} state
 * @param  {Date} payload.value
 * @return {Date}
 */
function update(state, { value }) {
  if (!value || dateUtil.isSameMonth(state, value)) {
    return state
  }
  return calendarUtil.getStartDateOfMonth(value)
}



module.exports = {
  [ACTION.TYPE.INITIALIZE] : initialize,
  [ACTION.TYPE.SELECT]     : update,
  [ACTION.TYPE.SHOW]       : update,
}