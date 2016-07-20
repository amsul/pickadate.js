const ACTION  = require('constants/action')
const STATE   = require('constants/state')

let dateUtil  = require('utils/date')
let valueUtil = require('utils/value')



/**
 * Initializes the value.
 * @param  {Object} [state=STATE.INITIAL.value]
 * @return {Date}
 */
function initialize(state = STATE.INITIAL.value) {
  return state
}



/**
 * Sets the selected date's value.
 * @param  {Object} state
 * @param  {String} payload.template
 * @param  {Date|null} payload.value
 * @return {String}
 */
function set(state, { scope, selected, template, value }) {

  // If there's no value, return the default value
  if (!value) {
    return ''
  }

  // Otherwise create the date to set
  value = valueUtil.createDateToSet(state, {
    scope,
    selected,
    value,
  })

  // If the value is the same as the state, return the state.
  // Otherwise formate the value with the template.
  return value === state ? state : dateUtil.format(value, template)

}



module.exports = {
  [ACTION.TYPE.INITIALIZE] : initialize,
  [ACTION.TYPE.SELECT]     : set,
  [ACTION.TYPE.SHOW]       : set,
}