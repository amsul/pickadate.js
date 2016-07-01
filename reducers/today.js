const ACTION = require('constants/action')



/**
 * Initializes the date today.
 * @return {Date}
 */
function initialize() {
  return new Date()
}



module.exports = {
  [ACTION.TYPE.INITIALIZE]: initialize
}