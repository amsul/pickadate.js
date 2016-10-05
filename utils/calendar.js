const NUMBER = require('constants/number')
const SCOPE  = require('constants/scope')
const STATE  = require('constants/state')

let dateUtil = require('utils/date')
let jsUtil   = require('utils/js')



//////////////
// WEEKDAYS //
//////////////



/**
 * Gets the weekdays for a given state.
 * @param  {LANGUAGE} language
 * @param  {Number} [firstDay=STATE.INITIAL.firstDay]
 * @return {(DAY.FULL|DAY.SHORT)[]}
 */
function getWeekdays(language, firstDay = STATE.INITIAL.firstDay) {

  let start = NUMBER.COLUMN_INDEX.DAY.START
  let end   = NUMBER.COLUMN_INDEX.DAY.END

  return jsUtil.createRange(start, end).map(dayIndex => (
    dateUtil.getShortDayName(
      language,
      (dayIndex + firstDay) % NUMBER.DAYS_IN_WEEK
    )
  ))

}





//////////////////////
// DATE COLLECTIONS //
//////////////////////



/**
 * Gets the dates for rows of a scope.
 * @param  {Date} view
 * @param  {SCOPE} scope
 * @param  {Number} [firstDay=STATE.INITIAL.firstDay]
 * @return {Array<Date[]>}
 */
function getDatesForRows(view, scope, firstDay = STATE.INITIAL.firstDay) {

  let year  = view.getFullYear()
  let month = view.getMonth()

  if (scope === SCOPE.YEARS) {
    return getDatesForRowsOfYears(year, month)
  }

  if (scope === SCOPE.MONTHS) {
    return getDatesForRowsOfMonths(year)
  }

  return getDatesForRowsOfWeeks(year, month, firstDay)

}



/**
 * Gets the dates for rows of years, given a year and month.
 * @param  {Number} year
 * @param  {Number} month
 * @return {Array<Date[]>}
 */
function getDatesForRowsOfYears(year, month) {

  year -= year % NUMBER.YEARS_IN_DECADE

  let start = NUMBER.ROW_INDEX.YEAR.START
  let end   = NUMBER.ROW_INDEX.YEAR.END

  return jsUtil.createRange(start, end).map(row => {

    let start = NUMBER.COLUMN_INDEX.YEAR.START
    let end   = NUMBER.COLUMN_INDEX.YEAR.END

    return jsUtil.createRange(start, end).map(column => (
      new Date(year + column + (row * NUMBER.COLUMN.YEARS), month, 1)
    ))

  })

}



/**
 * Gets the dates for rows of months, given a year.
 * @param  {Number} year
 * @return {Array<Date[]>}
 */
function getDatesForRowsOfMonths(year) {

  let start = NUMBER.ROW_INDEX.MONTH.START
  let end   = NUMBER.ROW_INDEX.MONTH.END

  return jsUtil.createRange(start, end).map(row => {

    let start = NUMBER.COLUMN_INDEX.MONTH.START
    let end   = NUMBER.COLUMN_INDEX.MONTH.END

    return jsUtil.createRange(start, end).map(column => (
      new Date(year, column + (row * NUMBER.COLUMN.MONTHS), 1)
    ))

  })
}



/**
 * Gets the dates for rows of weeks, given a year and month.
 * @param  {Number} year
 * @param  {Number} month
 * @param  {Number} [firstDay=STATE.INITIAL.firstDay]
 * @return {Array<Date[]>}
 *
 * Test with December, 2012 & firstDay as 6
 */
function getDatesForRowsOfWeeks(year, month, firstDay = STATE.INITIAL.firstDay) {

  let monthOfLastDayInFirstWeek = (
    getMonthOfLastDayInFirstWeek(year, month, firstDay)
  )

  let shift = monthOfLastDayInFirstWeek === month ? 0 : 1

  let start = NUMBER.ROW_INDEX.DATE.START + shift
  let end   = NUMBER.ROW_INDEX.DATE.END + shift

  return jsUtil.createRange(start, end).map(
    weekIndex => getDatesForWeek(year, month, weekIndex, firstDay)
  )

}



/**
 * Gets the dates for a week, given a year, month, and week index.
 * @param  {Number} year
 * @param  {Number} month
 * @param  {Number} weekIndex
 * @param  {Number} [firstDay=STATE.INITIAL.firstDay]
 * @return {Date[]}
 */
function getDatesForWeek(year, month, weekIndex, firstDay = STATE.INITIAL.firstDay) {

  let startDayOfMonth = getStartDayOfMonth(year, month)
  let startDayOfWeek  = weekIndex * NUMBER.DAYS_IN_WEEK

  let start = NUMBER.COLUMN_INDEX.DATE.START
  let end   = NUMBER.COLUMN_INDEX.DATE.END

  return jsUtil.createRange(start, end).map(date => (
    new Date(
      year,
      month,
      date + startDayOfWeek - startDayOfMonth + firstDay
    )
  ))

}



/**
 * Gets the month of the last day in the first week in the display of a month.
 * @private
 * @param  {Number} year
 * @param  {Number} month
 * @param  {Number} firstDay
 * @return {Number}
 */
function getMonthOfLastDayInFirstWeek(year, month, firstDay) {
  let startDayOfMonth = getStartDayOfMonth(year, month)
  return new Date(year, month, NUMBER.DAYS_IN_WEEK - startDayOfMonth).getMonth()
}



/**
 * Gets the start day of a month.
 * @private
 * @param  {Number} year
 * @param  {Number} month
 * @return {Number}
 */
function getStartDayOfMonth(year, month) {
  let startDateOfMonth = new Date(year, month, 1)
  return startDateOfMonth.getDay()
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

  return dateUtil.createInMonth(
    year + (change * NUMBER.YEARS_IN_DECADE),
    month,
    date
  )

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

  return dateUtil.createInMonth(year + change, month, date)

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

  return dateUtil.createInMonth(year, month + change, date)

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
 * @param  {LANGUAGE} language
 * @return {String}
 */
function getLabel(dateObject, scope, language) {

  if (scope === SCOPE.YEARS) {
    return `${dateObject.getFullYear()}`
  }

  if (scope === SCOPE.MONTHS) {
    return dateUtil.getShortMonthName(language, dateObject.getMonth())
  }

  return `${dateObject.getDate()}`

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

}