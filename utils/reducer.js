/**
 * Reduces a state by all reducers for a particular action type.
 *
 * @param  {Object} state
 * @param  {Object} action
 *         {ACTION.TYPE} action.type
 *         {Object} action.payload
 * @param  {Object<Function[]>} reducers
 *
 * @return {Object}
 */
function reduceAll(state, action, reducers) {
  return reducers.reduce(
    (state, reducer) => reducer[action.type](state, action.payload),
    state
  )
}



module.exports = {
  reduceAll,
}
