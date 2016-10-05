const LANGUAGE = require('constants/language')
const SCOPE    = require('constants/scope')



/**
 * The initial state of a picker.
 *
 * TODO: Add type validation and required state properties.
 *
 * @type {Object}
 */
const INITIAL = {
  disabled : null,
  firstDay : 0,
  language : LANGUAGE.ENGLISH,
  scope    : SCOPE.DAYS,
  selected : null,
  template : 'D MMMM, YYYY',
  today    : null,
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