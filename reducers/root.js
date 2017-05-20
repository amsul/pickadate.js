const actionTypeReducer = require('reducers/action-type')



/**
 * Reduces a state by an action.
 * @param  {Object} state
 * @param  {Object} action
 *         {ACTION.TYPE} action.type
 *         {Object} [action.payload]
 * @return {Object}
 */
module.exports = function rootReducer(state, action) {
  const reducer = actionTypeReducer[action.type]
  return reducer ? reducer(state, action) : state
}
