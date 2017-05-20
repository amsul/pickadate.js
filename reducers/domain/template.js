const ACTION = require('constants/action')



/**
 * Sets the template.
 * @param  {Object} state
 * @param  {Object} payload
 *         {String} payload.template
 * @return {Object}
 */
function set(state, payload) {

  const { template } = payload

  if (!template || template === state.template) {
    return state
  }

  return { ...state, template }

}



module.exports = {
  [ACTION.TYPE.INITIALIZE]: set,
}
