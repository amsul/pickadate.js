const ACTION   = require('constants/action')
const dateUtil = require('utils/date')
const jsUtil   = require('utils/js')



/**
 * Initializes the disabled dates, days, and exceptions.
 * @param  {Object} state
 * @param  {Object} [payload={}]
 *         {Object} [payload.disabled]
 *         {Date[]} [payload.disabled.dates]
 *         {Number[]} [payload.disabled.days]
 *         {Date[]} [payload.disabled.exceptions]
 * @return {Object}
 */
function initialize(state, payload = {}) {

  const {
    disabled = {}
  } = payload

  return {
    ...state,
    disabled: {
      dates      : disabled.dates ? [...disabled.dates] : [],
      days       : disabled.days ? [...disabled.days] : [],
      exceptions : disabled.exceptions ? [...disabled.exceptions] : [],
    },
  }

}



/**
 * Adds values to the disabled dates and days
 * while also removing it from the exceptions.
 * @param  {Object} state
 * @param  {Object} payload
 *         {(Date|Number)[]} payload.values
 * @return {Object}
 */
function add(state, payload) {

  const disabled = { ...state.disabled }

  payload.values.forEach(value => {

    // If the value to add is a number, add it to the disabled days
    if (typeof value === 'number') {
      disabled.days = jsUtil.addToArray(disabled.days, value)
      return
    }

    // Otherwise add it to the disabled dates
    disabled.dates = jsUtil.addToArray(
      disabled.dates,
      value,
      dateUtil.isSameDate
    )

    // And then remove it from the disabled exceptions
    disabled.exceptions = jsUtil.removeFromArray(
      disabled.exceptions,
      value,
      dateUtil.isSameDate
    )

  })

  // If none of the values have changed, return the original state
  const hasAnyValueChanged = jsUtil.hasChanged(
    state.disabled,
    disabled,
    'dates', 'days', 'exceptions'
  )
  if (!hasAnyValueChanged) {
    return state
  }

  return { ...state, disabled }

}



/**
 * Removes values from the disabled dates and days
 * while also adding it to the exceptions.
 * @param  {Object} state
 * @param  {Object} payload
 *         {(Date|Number)[]} payload.values
 * @return {Object}
 */
function remove(state, payload) {

  const disabled = { ...state.disabled }

  payload.values.forEach(value => {

    // If the value to remove is a number, remove it from the disabled days
    if (typeof value === 'number') {
      disabled.days = jsUtil.removeFromArray(disabled.days, value)
      return
    }

    // Otherwise remove it from the disabled dates
    disabled.dates = jsUtil.removeFromArray(
      disabled.dates,
      value,
      dateUtil.isSameDate
    )

    // And then add it to the disabled exceptions
    disabled.exceptions = jsUtil.addToArray(
      disabled.exceptions,
      value,
      dateUtil.isSameDate
    )

  })

  // If none of the values have changed, return the original state
  const hasAnyValueChanged = jsUtil.hasChanged(
    state.disabled,
    disabled,
    'dates', 'days', 'exceptions'
  )
  if (!hasAnyValueChanged) {
    return state
  }

  return { ...state, disabled }

}



module.exports = {
  [ACTION.TYPE.DISABLE]    : add,
  [ACTION.TYPE.ENABLE]     : remove,
  [ACTION.TYPE.INITIALIZE] : initialize,
}
