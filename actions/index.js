const ACTION       = require('constants/action')
const calendarUtil = require('utils/calendar')



////////////
// SELECT //
////////////



/**
 * Returns an action that selects a value.
 * @param  {Object} state
 * @param  {Date|Number|String|null} [value]
 * @param  {String} [template=state.template]
 * @return {Object}
 */
const select = (state, value, template = state.template) => ({
  type    : ACTION.TYPE.SELECT,
  payload : {
    language : state.language,
    scope    : state.scope,
    template,
    value,
  },
})



/**
 * Returns an action that clears the value.
 * @return {Object}
 */
const clear = () => select({}, null)





//////////
// SHOW //
//////////



/**
 * Returns an action that selects a scoped value.
 * @param  {Object} state
 * @param  {Date|Number|String} value
 * @param  {String} [template=state.template]
 * @return {Object}
 */
const show = (state, value, template = state.template) => ({
  type    : ACTION.TYPE.SHOW,
  payload : {
    language : state.language,
    scope    : state.scope,
    template,
    value,
  },
})



/**
 * Returns an action that selects a scoped value from the previous view.
 * @param  {Object} state
 * @return {Object}
 */
const showPrevious = ({ scope, selected, view }) => (
  show(
    { scope },
    calendarUtil.getDateOfPreviousScope(selected || view, scope)
  )
)



/**
 * Returns an action that selects a scoped value from the next view.
 * @param  {Object} state
 * @return {Object}
 */
const showNext = ({ scope, selected, view }) => (
  show(
    { scope },
    calendarUtil.getDateOfNextScope(selected || view, scope)
  )
)



/**
 * Returns an action that selects "today".
 * @param  {Object} state
 * @return {Object}
 */
const showToday = ({ scope, today }) => (
  show({ scope }, today)
)





///////////
// SCOPE //
///////////



/**
 * Returns an action that cycles through the scopes.
 * @return {Object}
 */
const cycleScope = () => ({
  type: ACTION.TYPE.CYCLE_SCOPE,
})





/////////////
// DISABLE //
/////////////



/**
 * Returns an action that disables dates and days.
 * @param  {Object}    state
 * @param  {...(Date|Number)} values
 * @return {Object}
 */
const disable = (state, ...values) => ({
  type    : ACTION.TYPE.DISABLE,
  payload : { values },
})



/**
 * Returns an action that enables dates and days.
 * @param  {Object}    state
 * @param  {...(Date|Number)} values
 * @return {Object}
 */
const enable = (state, ...values) => ({
  type    : ACTION.TYPE.ENABLE,
  payload : { values },
})





//////////////
// LANGUAGE //
//////////////



/**
 * Returns an action that sets the language.
 * @param  {Object} state
 * @param  {LANGUAGE} value
 * @return {Object}
 */
const setLanguage = (state, value) => ({
  type    : ACTION.TYPE.SET_LANGUAGE,
  payload : { value },
})





///////////////
// FIRST DAY //
///////////////



/**
 * Returns an action that sets the first day of the week.
 * @param  {Number} state
 * @param  {Number} value
 * @return {Object}
 */
const setFirstDay = (state, value) => ({
  type    : ACTION.TYPE.SET_FIRST_DAY,
  payload : { value: value % 7 },
})





/////////////
// EXPORTS //
/////////////



module.exports = {

  // Select
  clear,
  select,

  // Show
  show,
  showNext,
  showPrevious,
  showToday,

  // Scope
  cycleScope,

  // Disable
  disable,
  enable,

  // Language
  setLanguage,

  // First day of week
  setFirstDay,

}
