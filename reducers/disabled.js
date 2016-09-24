const ACTION  = require('constants/action')

let dateUtil  = require('utils/date')
let jsUtil    = require('utils/js')
let stateUtil = require('utils/state')



/**
 * Initializes the disabled dates, days, and exceptions.
 * @return {Object}
 */
function initialize() {
  return {
    dates      : [],
    days       : [],
    exceptions : [],
  }
}



/**
 * Adds values to the disabled dates and days
 * while also removing it from the exceptions.
 * @param  {Object} state
 * @param  {(Date|Number)[]} payload.values
 * @return {Object}
 */
function add(state, { values }) {

  let nextState = { ...state }

  values.forEach(value => {

    // If the value to add is a number,
    // add it to the disabled days
    if (typeof value === 'number') {
      nextState.days = jsUtil.addToArray(nextState.days, value)
      return
    }

    // Otherwise add it to the disabled dates
    nextState.dates = jsUtil.addToArray(
      nextState.dates,
      value,
      dateUtil.isSameDate
    )

    // And then remove it from the disabled exceptions
    nextState.exceptions = jsUtil.removeFromArray(
      nextState.exceptions,
      value,
      dateUtil.isSameDate
    )

  })

  // If the state hasn't changed,
  // return the original state object
  return (
    stateUtil.isChangingAny(state, nextState, 'dates', 'days', 'exceptions')
      ? nextState
      : state
  )

}



/**
 * Removes values from the disabled dates and days
 * while also adding it to the exceptions.
 * @param  {Object} state
 * @param  {(Date|Number)[]} payload.values
 * @return {Object}
 */
function remove(state, { values }) {

  let nextState = { ...state }

  values.forEach(value => {

    // If the value to remove is a number,
    // remove it from the disabled days
    if (typeof value === 'number') {
      nextState.days = jsUtil.removeFromArray(nextState.days, value)
      return
    }

    // Otherwise remove it from the disabled dates
    nextState.dates = jsUtil.removeFromArray(
      nextState.dates,
      value,
      dateUtil.isSameDate
    )

    // And then add it to the disabled exceptions
    nextState.exceptions = jsUtil.addToArray(
      nextState.exceptions,
      value,
      dateUtil.isSameDate
    )

  })

  // If the state hasn't changed,
  // return the original state object
  return (
    stateUtil.isChangingAny(state, nextState, 'dates', 'days', 'exceptions')
      ? nextState
      : state
  )

}



module.exports = {
  [ACTION.TYPE.DISABLE]    : add,
  [ACTION.TYPE.ENABLE]     : remove,
  [ACTION.TYPE.INITIALIZE] : initialize,
}