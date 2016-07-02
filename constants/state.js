const SCOPE = require('constants/scope')



/**
 * The initial state of a picker.
 *
 * TODO: Add type validation and required state properties.
 *
 * @type {Object}
 */
const INITIAL = {
  template : 'd mmmm, yyyy',
  scope    : SCOPE.DAYS,
  selected : null,
  today    : null,
  value    : '',
  view     : null,
}



/**
 * The keys of the state.
 * @type {Object(String)}
 */
const KEYS = Object.keys(INITIAL)



module.exports = {
  INITIAL,
  KEYS,
}