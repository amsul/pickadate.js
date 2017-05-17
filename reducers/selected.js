const ACTION       = require('constants/action')
const dateUtil     = require('utils/date')
const selectedUtil = require('utils/selected')



/**
 * Initializes the selected date, defaulting to `null`.
 * @param  {Object} state
 * @param  {LANGUAGE} payload.language
 * @param  {String} payload.template
 * @param  {Date|Number|String|null} payload.value
 * @return {Date|null}
 */
function initialize(state, { language, template, value }) {

  // If there was no value and there is no new value,
  // return the default value
  if (!state && !value) {
    return null
  }

  // If the value is a string, parse it
  if (typeof value === 'string') {
    value = dateUtil.parse(value, template, language)
  }

  // Create the date from the value or state
  return dateUtil.create(value || state)

}



/**
 * Sets the selected date.
 * @param  {Object} state
 * @param  {LANGUAGE} payload.language
 * @param  {SCOPE} payload.scope
 * @param  {String} payload.template
 * @param  {Date|Number|String|null} payload.value
 * @return {Date|null}
 */
function set(state, { language, scope, template, value }) {

  // If there's no value, return the default value
  if (!value) {
    return null
  }

  // If the value is a string, parse it
  if (typeof value === 'string') {
    value = dateUtil.parse(value, template, language)
  }

  // Create the date to set
  return selectedUtil.createDateToSet(state, {
    scope,
    selected: state,
    value,
  })

}



module.exports = {
  [ACTION.TYPE.INITIALIZE] : initialize,
  [ACTION.TYPE.SELECT]     : set,
  [ACTION.TYPE.SHOW]       : set,
}
