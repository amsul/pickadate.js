const ACTION = require('constants/action')
const STATE  = require('constants/state')



/**
 * Initializes the date today.
 * @param  {String} state
 * @return {String}
 */
function initialize(state = STATE.INITIAL.template) {
  return state
}



/**
 * Sets the template to use for formatting the selected value.
 * @param  {String} state
 * @param  {String} payload.template
 * @return {String}
 */
function set(state, { template }) {
  return template
}



module.exports = {
  [ACTION.TYPE.FORMAT]     : set,
  [ACTION.TYPE.INITIALIZE] : initialize,
}