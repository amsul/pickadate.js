const ACTION       = require('constants/action')
const PERIOD       = require('constants/period')
const calendarUtil = require('utils/calendar')
const dateUtil     = require('utils/date')



/**
 * Initializes the selected date.
 * @param  {Object} state
 * @param  {Object} payload
 *         {Date|Number|String|null} [payload.selected]
 *         {String} [payload.template]
 * @return {Object}
 */
function initialize(state, payload) {

  const {
    selected = state.selected,
    template = state.template,
  } = payload

  // If there is no value, return the original state
  if (!selected) {
    return state
  }

  return set(state, { template, value: selected })

}



/**
 * Sets the selected date.
 *
 * TODO: Set the closest date when `isClampedToMonth` is true and
 *       the value is disabled.
 *
 * @param  {Object} state
 * @param  {Object} payload
 *         {Boolean} payload.isClampedToMonth
 *         {Date|Number|String|null} payload.value
 *         {String} [payload.template]
 * @return {Object}
 */
function set(state, payload) {

  let { value } = payload

  // If there is no value and no selected date,
  // return the original state
  if (!value && !state.selected) {
    return state
  }

  // If there's no value, remove the selected date
  if (!value) {
    return { ...state, selected: null }
  }

  // If the value is a string, parse it
  if (typeof value === 'string') {
    value = dateUtil.parse(
      value,
      payload.template || state.template,
      state.language
    )
    if (!value) {
      console.error('Unable to parse %o', payload.value)
      return state
    }
  }

  // Create the date from the value
  value = dateUtil.create(value)

  // If setting the date is clamped to the month and there is a selected date,
  // create the date in the month of the target value using the selected date
  if (payload.isClampedToMonth && state.selected) {
    value = dateUtil.createInMonth(
      value.getFullYear(),
      value.getMonth(),
      state.selected.getDate()
    )
  }

  // If there is a selected date and it's the same as the value,
  // return the original state
  if (state.selected && dateUtil.isSameDate(state.selected, value)) {
    return state
  }

  // If the date is disabled, return the original state
  const isValueDisabled = calendarUtil.isDisabled(value, {
    disabled : state.disabled,
    minimum  : state.minimum,
    scope    : state.scope,
  })
  if (isValueDisabled) {
    return state
  }

  return { ...state, selected: value }

}



/**
 * Sets the selected date in a certain period.
 * @param  {Object} state
 * @param  {Object} payload
 *         {PERIOD.ID} payload.period
 * @return {Object}
 */
function setInPeriod(state, payload) {

  const startDate = state.selected || state.today

  const value = (
    payload.period === PERIOD.ID.PREVIOUS
      ? calendarUtil.getDateOfPreviousScope(startDate, state.scope) :
    payload.period === PERIOD.ID.NEXT
      ? calendarUtil.getDateOfNextScope(startDate, state.scope) :
    payload.period === PERIOD.ID.TODAY
      ? state.today :
    null
  )

  if (!value) {
    return state
  }

  return set(state, { isClampedToMonth: true, value })

}



module.exports = {
  [ACTION.TYPE.INITIALIZE]       : initialize,
  [ACTION.TYPE.SELECT]           : set,
  [ACTION.TYPE.SELECT_IN_PERIOD] : setInPeriod,
}
