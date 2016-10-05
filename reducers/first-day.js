const ACTION = require('constants/action')



/**
 * Sets the first day of the week.
 * @param  {Number} state
 * @param  {Number} payload.value
 * @return {Number}
 */
function set(state, { value }) {
  return value == null ? state : value
}



module.exports = {
  [ACTION.TYPE.SET_FIRST_DAY]: set,
}