const ACTION  = require('constants/action')

let dateUtil  = require('utils/date')
let valueUtil = require('utils/value')



/**
 * Initializes the selected date, defaulting to `null`.
 * @param  {Object} state
 * @param  {String} [payload.template]
 * @param  {String} [payload.value]
 * @return {Date|null}
 */
function initialize(state, { template, value }) {
  if (value) {
    return dateUtil.parse(value, template)
  }
  return state ? dateUtil.create(state) : null
}



/**
 * Sets the selected date.
 * @param  {Object} state
 * @param  {SCOPE} payload.scope
 * @param  {Date|null} payload.value
 * @return {Date|null}
 */
function set(state, { scope, value }) {

  // If there's no value, return the default value
  if (!value) {
    return null
  }

  // Otherwise create the date to set
  return valueUtil.createDateToSet(state, {
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