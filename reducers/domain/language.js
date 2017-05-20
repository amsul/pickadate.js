const ACTION = require('constants/action')



/**
 * Sets the language.
 * @param  {Object} state
 * @param  {Object} payload
 *         {LANGUAGE} payload.language
 * @return {Object}
 */
function set(state, payload) {

  const { language } = payload

  if (!language || language === state.language) {
    return state
  }

  return { ...state, language }

}



module.exports = {
  [ACTION.TYPE.INITIALIZE]   : set,
  [ACTION.TYPE.SET_LANGUAGE] : set,
}
