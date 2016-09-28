const ACTION = require('constants/action')



/**
 * Sets the language.
 * @param  {LANGUAGE} state
 * @param  {LANGUAGE} payload.value
 * @return {LANGUAGE}
 */
function set(state, { value }) {
  return value || state
}



module.exports = {
  [ACTION.TYPE.SET_LANGUAGE]: set,
}