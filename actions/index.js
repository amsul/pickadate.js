const ACTION = require('constants/action')
const PERIOD = require('constants/period')



////////////
// SELECT //
////////////



/**
 * Returns an action that selects a value.
 * @param  {Date|Number|String|null} [value]
 * @param  {String} [template]
 * @return {Object}
 */
const select = (value, template) => ({
  type    : ACTION.TYPE.SELECT,
  payload : { template, value },
})



/**
 * Returns an action that clears the value.
 * @return {Object}
 */
const clear = () => select(null)



/**
 * Returns an action that selects a value in a period.
 * @param  {PERIOD.ID} period
 * @return {Object}
 */
const selectInPeriod = (period) => ({
  type    : ACTION.TYPE.SELECT_IN_PERIOD,
  payload : { period },
})



/**
 * Returns an action that selects a value in the previous period.
 * @return {Object}
 */
const selectInPreviousPeriod = () => selectInPeriod(PERIOD.ID.PREVIOUS)



/**
 * Returns an action that selects a value in the next period.
 * @return {Object}
 */
const selectInNextPeriod = () => selectInPeriod(PERIOD.ID.NEXT)



/**
 * Returns an action that selects a value in the "today" period.
 * @return {Object}
 */
const selectInTodayPeriod = () => selectInPeriod(PERIOD.ID.TODAY)





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
 * @param  {...(Date|Number)} values
 * @return {Object}
 */
const disable = (...values) => ({
  type    : ACTION.TYPE.DISABLE,
  payload : { values },
})



/**
 * Returns an action that enables dates and days.
 * @param  {...(Date|Number)} values
 * @return {Object}
 */
const enable = (...values) => ({
  type    : ACTION.TYPE.ENABLE,
  payload : { values },
})





//////////////
// LANGUAGE //
//////////////



/**
 * Returns an action that sets the language.
 * @param  {LANGUAGE} language
 * @return {Object}
 */
const setLanguage = (language) => ({
  type    : ACTION.TYPE.SET_LANGUAGE,
  payload : { language },
})





///////////////
// FIRST DAY //
///////////////



/**
 * Returns an action that sets the first day of the week.
 * @param  {Number} firstDay
 * @return {Object}
 */
const setFirstDay = (firstDay) => ({
  type    : ACTION.TYPE.SET_FIRST_DAY,
  payload : { firstDay },
})





/////////////
// EXPORTS //
/////////////



module.exports = {

  // Select
  clear,
  select,
  selectInNextPeriod,
  selectInPreviousPeriod,
  selectInTodayPeriod,

  // Scope
  cycleScope,

  // Disable
  disable,
  enable,

  // Language
  setLanguage,

  // First day
  setFirstDay,

}
