const ACTION = require('constants/action')
const STATE  = require('constants/state')

let dateUtil = require('utils/date')



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
function set(state, { template, value }) {
  return value ? dateUtil.format(value, template) : ''
}



module.exports = {
  [ACTION.TYPE.INITIALIZE] : initialize,
  [ACTION.TYPE.SELECT]     : set,
}