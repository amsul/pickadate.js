const SCOPE  = require('constants/scope')

let dateUtil = require('utils/date')
let jsUtil   = require('utils/js')



//////////////
// WEEKDAYS //
//////////////



/**
 * Gets the weekdays for a given state.
 * @param  {Object} state
 * @return {DAY.FULL|DAY.SHORT}
 */
function getWeekdays(state) {

  // TODO: Check the state to determine the weekdays to return

  return jsUtil.createRange(0, 6).map(dayIndex => (
    dateUtil.getShortDayName(dayIndex)
  ))

}





//////////////////////
// DATE COLLECTIONS //
//////////////////////



/**
 * Gets the dates for rows of a scope.
 * @param  {Object} state
 *         {SCOPE} state.scope
 *         {Date} state.view
 * @return {Array<Date[]>}
 */
function getDatesForRows(state) {

  // TODO: Check state.selected to determine the date to use

  let { scope, view } = state

  let year  = view.getFullYear()
  let month = view.getMonth()

  if (scope === SCOPE.YEARS) {
    return getDatesForRowsOfYears(year, month)
  }

  if (scope === SCOPE.MONTHS) {
    return getDatesForRowsOfMonths(year)
  }

  return getDatesForRowsOfWeeks(year, month)

}



/**
 * Gets the dates for rows of years, given a year and month.
 * @param  {Number} year
 * @param  {Number} month
 * @return {Array<Date[]>}
 */
function getDatesForRowsOfYears(year, month) {

  year -= year % 10

  return jsUtil.createRange(0, 1).map(row => (
    jsUtil.createRange(0, 4).map(column => (
      new Date(year + column + (row * 5), month, 1)
    ))
  ))

}



/**
 * Gets the dates for rows of months, given a year.
 * @param  {Number} year
 * @return {Array<Date[]>}
 */
function getDatesForRowsOfMonths(year) {
  return jsUtil.createRange(0, 2).map(row => (
    jsUtil.createRange(0, 3).map(column => (
      new Date(year, column + (row * 4), 1)
    ))
  ))
}



/**
 * Gets the dates for rows of weeks, given a year and month.
 * @param  {Number} year
 * @param  {Number} month
 * @return {Array[]}
 */
function getDatesForRowsOfWeeks(year, month) {
  return jsUtil.createRange(0, 5).map(
    weekIndex => getDatesForWeek(year, month, weekIndex)
  )
}



/**
 * Gets the dates for a week, given a year, month, and week index.
 * @param  {Number} year
 * @param  {Number} month
 * @param  {Number} weekIndex
 * @return {Date[]}
 */
function getDatesForWeek(year, month, weekIndex) {

  let startDateOfMonth = new Date(year, month, 1)
  let startDayOfMonth  = startDateOfMonth.getDay()

  return jsUtil.createRange(1, 7).map(dayNumber => {
    let day = (weekIndex * 7) + dayNumber - startDayOfMonth
    return new Date(year, month, day)
  })

}





////////////////////
// RELATIVE DATES //
////////////////////



/**
 * Gets the date of a relative decade, given a date.
 * @private
 * @param  {Date} dateObject
 * @param  {Number} change
 * @return {Date}
 */
function getDateRelativeToDecade(dateObject, change) {

  dateObject = dateUtil.create(dateObject)

  let year  = dateObject.getFullYear()
  let month = dateObject.getMonth()
  let date  = dateObject.getDate()

  return getClosestDateForMonth(year + (change * 10), month, date)

}



/**
 * Gets the date of a relative year, given a date.
 * @private
 * @param  {Date} dateObject
 * @param  {Number} change
 * @return {Date}
 */
function getDateRelativeToYear(dateObject, change) {

  dateObject = dateUtil.create(dateObject)

  let year  = dateObject.getFullYear()
  let month = dateObject.getMonth()
  let date  = dateObject.getDate()

  return getClosestDateForMonth(year + change, month, date)

}



/**
 * Gets the date of a relative month, given a date.
 * @private
 * @param  {Date} dateObject
 * @param  {Number} change
 * @return {Date}
 */
function getDateRelativeToMonth(dateObject, change) {

  dateObject = dateUtil.create(dateObject)

  let year  = dateObject.getFullYear()
  let month = dateObject.getMonth()
  let date  = dateObject.getDate()

  return getClosestDateForMonth(year, month + change, date)

}



/**
 * Gets the closest date for a month, ensuring that the
 * @private
 * @param  {Number} year
 * @param  {Number} month
 * @param  {Number} date
 * @return {Date}
 */
function getClosestDateForMonth(year, month, date) {

  while (date >= 0) {
    let dateObject = new Date(year, month, date)
    if (dateObject.getMonth() === month) {
      return dateObject
    }
    date -= 1
  }

  return new Date(year, month, 1)

}





/////////////////////////
// NEXT RELATIVE DATES //
/////////////////////////



/**
 * Gets the date for the next scope.
 * @param  {Date} dateObject
 * @param  {SCOPE} scope
 * @return {Date}
 */
function getDateOfNextScope(dateObject, scope) {

  let dateGetter = (
    scope === SCOPE.YEARS ? getDateOfNextDecade :
    scope === SCOPE.MONTHS ? getDateOfNextYear :
    getDateOfNextMonth
  )

  return dateGetter(dateObject)

}



/**
 * Gets the date of the next decade, given a date.
 * @param  {Date} dateObject
 * @return {Date}
 */
function getDateOfNextDecade(dateObject) {
  return getDateRelativeToDecade(dateObject, 1)
}



/**
 * Gets the date of the next year, given a date.
 * @param  {Date} dateObject
 * @return {Date}
 */
function getDateOfNextYear(dateObject) {
  return getDateRelativeToYear(dateObject, 1)
}



/**
 * Gets the date of the next month, given a date.
 * @param  {Date} dateObject
 * @return {Date}
 */
function getDateOfNextMonth(dateObject) {
  return getDateRelativeToMonth(dateObject, 1)
}





/////////////////////////////
// PREVIOUS RELATIVE DATES //
/////////////////////////////



/**
 * Gets the date for the previous scope.
 * @param  {Date} dateObject
 * @param  {SCOPE} scope
 * @return {Date}
 */
function getDateOfPreviousScope(dateObject, scope) {

  let dateGetter = (
    scope === SCOPE.YEARS ? getDateOfPreviousDecade :
    scope === SCOPE.MONTHS ? getDateOfPreviousYear :
    getDateOfPreviousMonth
  )

  return dateGetter(dateObject)

}



/**
 * Gets the date of the previous decade, given a date.
 * @param  {Date} dateObject
 * @return {Date}
 */
function getDateOfPreviousDecade(dateObject) {
  return getDateRelativeToDecade(dateObject, -1)
}



/**
 * Gets the date of the previous year, given a date.
 * @param  {Date} dateObject
 * @return {Date}
 */
function getDateOfPreviousYear(dateObject) {
  return getDateRelativeToYear(dateObject, -1)
}



/**
 * Gets the date of the previous month, given a date.
 * @param  {Date} dateObject
 * @return {Date}
 */
function getDateOfPreviousMonth(dateObject) {
  return getDateRelativeToMonth(dateObject, -1)
}





/////////////////
// START DATES //
/////////////////



/**
 * Gets the start date of a month, give a date.
 * @param  {Date} dateObject
 * @return {Date}
 */
function getStartDateOfMonth(dateObject) {
  dateObject = dateUtil.create(dateObject)
  let year   = dateObject.getFullYear()
  let month  = dateObject.getMonth()
  return new Date(year, month, 1)
}



/**
 * Gets the start date of a month in the next scope.
 * @param  {Date} dateObject
 * @param  {SCOPE} scope
 * @return {Date}
 */
function getStartDateOfMonthInNextScope(dateObject, scope) {
  dateObject = getDateOfNextScope(dateObject, scope)
  return getStartDateOfMonth(dateObject)
}



/**
 * Gets the start date of a month in the previous scope.
 * @param  {Date} dateObject
 * @param  {SCOPE} scope
 * @return {Date}
 */
function getStartDateOfMonthInPreviousScope(dateObject, scope) {
  dateObject = getDateOfPreviousScope(dateObject, scope)
  return getStartDateOfMonth(dateObject)
}





////////////
// LABELS //
////////////



/**
 * Gets the label for a date, given a scope.
 * @param  {Date} dateObject
 * @param  {SCOPE} scope
 * @return {String}
 */
function getLabel(dateObject, scope) {

  if (scope === SCOPE.YEARS) {
    return `${dateObject.getFullYear()}`
  }

  if (scope === SCOPE.MONTHS) {
    return dateUtil.getShortMonthName(dateObject.getMonth())
  }

  return `${dateObject.getDate()}`

}



/**
 * Gets the label for a range of dates, given a scope.
 * @param  {Date} dateObject
 * @param  {SCOPE} scope
 * @return {String}
 */
function getRangeLabel(dateObject, scope) {

  let year  = dateObject.getFullYear()
  let month = dateObject.getMonth()

  if (scope === SCOPE.YEARS) {
    let decadeStartYear = year - year % 10
    let decadeEndYear   = decadeStartYear + 9
    return `${decadeStartYear} - ${decadeEndYear}`
  }

  if (scope === SCOPE.MONTHS) {
    return `${year}`
  }

  return `${dateUtil.getFullMonthName(month)} ${year}`

}





/////////////
// EXPORTS //
/////////////



module.exports = {

  // Weekdays
  getWeekdays,

  // Date collections
  getDatesForRows,
  getDatesForRowsOfMonths,
  getDatesForRowsOfWeeks,
  getDatesForRowsOfYears,
  getDatesForWeek,

  // Relative dates
  getDateOfNextDecade,
  getDateOfNextMonth,
  getDateOfNextScope,
  getDateOfNextYear,
  getDateOfPreviousDecade,
  getDateOfPreviousMonth,
  getDateOfPreviousScope,
  getDateOfPreviousYear,

  // Start dates
  getStartDateOfMonth,
  getStartDateOfMonthInNextScope,
  getStartDateOfMonthInPreviousScope,

  // Labels
  getLabel,
  getRangeLabel,

}