const ACTION = require('constants/action')



/**
 * Initializes the date today.
 * @param  {Date} [state=new Date()]
 * @return {Date}
 */
function initialize(state = new Date()) {
  return state
}



module.exports = {
  [ACTION.TYPE.INITIALIZE]: initialize
}