const ACTION = require('constants/action')



/**
 * Initializes the date today.
 * @param  {Object} state
 * @return {Object}
 */
function initialize(state) {
  return {
    ...state,
    today: new Date()
  }
}



module.exports = {
  [ACTION.TYPE.INITIALIZE]: initialize,
}
