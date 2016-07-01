const ACTION = require('constants/action')
const STATE  = require('constants/state')

let dateUtil = require('utils/date')



/**
 * Initializes the selected date, defaulting to `null`
 * @param  {Object} state
 * @return {Date|null}
 */
function initialize(state) {
  return state ? dateUtil.create(state) : STATE.INITIAL.selected
}



/**
 * Sets the selected date.
 * @param  {Object} state
 * @param  {Date|null} payload.value
 * @return {Date|null}
 */
function set(state, { value }) {

  if (!value) {
    return STATE.INITIAL.selected
  }

  if (dateUtil.isSameDate(state, value)) {
    return state
  }

  return dateUtil.create(value)

}



module.exports = {
  [ACTION.TYPE.INITIALIZE] : initialize,
  [ACTION.TYPE.SELECT]     : set,
}