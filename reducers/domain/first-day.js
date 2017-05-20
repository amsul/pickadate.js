const ACTION = require('constants/action')



/**
 * Sets the first day of the week.
 * @param  {Object} state
 * @param  {Number} payload
 *         {Number} [payload.firstDay]
 * @return {Object}
 */
function set(state, payload) {

  let { firstDay } = payload

  if (firstDay == null) {
    return state
  }

  firstDay = firstDay % 7

  if (firstDay === state.firstDay) {
    return state
  }

  return { ...state, firstDay }

}



module.exports = {
  [ACTION.TYPE.INITIALIZE]    : set,
  [ACTION.TYPE.SET_FIRST_DAY] : set,
}
